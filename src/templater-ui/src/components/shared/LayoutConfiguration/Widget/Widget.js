/* eslint-disable no-magic-numbers, import/order, no-sequences */
import React, {
    useCallback,
    useMemo
}                         from 'react';
import classnames         from 'classnames/bind';
import PropTypes          from 'prop-types';

import CriticalValue      from '../../../base/CriticalValue';
import Tooltip            from '../../../base/Tooltip';
import IconButton         from '../../../base/IconButton';
import Switch             from '../../../base/Switch';
import Thermostat         from '../../../base/controls/Thermostat';
import List               from '../../../base/controls/List';
import Switcher           from '../../../base/controls/Switcher';
import Slider             from '../../../base/controls/Slider';
import Base               from '../../../base/controls/Base';
import ColorPickerPreview from '../../../base/controls/ColorPicker/ColorPickerPreview';
import Led                from '../../../base/controls/Led';
import Bulb               from '../../../base/controls/Bulb/Bulb';
import CircularProgress   from '../../../base/CircularProgress';
import PushButton         from '../../../base/Button/PushButton';
import TwoWayButton       from '../../../base/controls/TwoWayButton';
import Tumbler            from '../../../base/controls/Tumbler';
import SignalLevel        from '../../../base/controls/SignalLevel';
import Battery            from '../../../base/controls/Battery';
import Door               from '../../../base/controls/Door';
import TimePicker         from '../../../base/controls/TimePicker';
import MotionSensor       from '../../../base/controls/MotionSensor';
import TextControl        from '../../../base/controls/TextControl';

import { EMPTY_TEXT }     from '../../../../constants/index';

import {
    LAYOUT_CONTENT_ID
}                         from '../../../../constants/layouts';
import {
    TIMELINE_WIDGET_DATA
}                         from '../../../../constants/localStorage';

import * as localStorageUtils from '../../../../utils/helpers/localStorage';

// import { TOASTS_KEYS } from 'Constants/toasts';
import styles             from './Widget.less';


const cx = classnames.bind(styles);


const WIDGET_TYPES_WITH_EDIT_SCREEN = [ 'input', 'color' ];
const WIDGET_TYPES_WITH_READ_ONLY_SCREEN = [ 'gauge' ];

// eslint-disable-next-line complexity
function Widget(props) {    // eslint-disable-line max-lines-per-function
    const {
        onDelete, onChange, openWidgetScreen,
        openModal, closeModal, isEditMode,
        isBrokerConnected, setWidgetValue,
        setIsDragDisabled, isDeviceDisabled,
        phoneMode, isProcessing, deviceId,
        dataType, themeMode, topics, t, values, ...widgetData
    } = props;

    const { value, name, type, id, advanced, settable, widgetTopic, format } = widgetData || {};
    const isSettable = !!settable && !isDeviceDisabled;
    const isMultipleTopics = topics?.length > 1;

    const withEditScreen = !!WIDGET_TYPES_WITH_EDIT_SCREEN?.includes(type) || isMultipleTopics;
    const withReadOnlyScreen = !!WIDGET_TYPES_WITH_READ_ONLY_SCREEN?.includes(type) ||
        !!advanced?.withTimelines; // change the second condition if similar logic appears for another widget

    async function handleChangeField({ value, onError, onSuccess } = {}) {  // eslint-disable-line no-shadow
        if (isProcessing || !isBrokerConnected) return;

        try {
            await setWidgetValue({
                topic   : widgetTopic,
                value,
                onError : () => {
                    if (onError) onError({ prevValue: widgetData?.value });
                },
                onSuccess
            });
        } catch (error) {
            // pass
            console.error('Edit widget value error: ', { error });
        }
    }
    function handleToggleMenu({ isOpened }) {
        setIsDragDisabled(isOpened);
    }

    // eslint-disable-next-line max-lines-per-function,complexity
    function renderValue() {
        let Component = null;
        let valueFieldWidth = '100%';

        if (advanced?.unit) valueFieldWidth = '30px';
        if (!advanced?.unit && (withEditScreen || withReadOnlyScreen || isMultipleTopics)) {
            valueFieldWidth = 'calc(100% - 25px)';
        }

        const widgetProps = {
            name       : widgetTopic,
            onChange   : handleChangeField,
            isDisabled : !isBrokerConnected || !isSettable,
            value,
            isProcessing,
            themeMode
        };

        function getMultipltBulbValue() {
            const firstPart = (true, 'true')?.includes(values[0]) ? 'ON' : 'OFF';
            const secondPart = values[1] ? `(${values[1]})` : '';

            return `${firstPart} ${secondPart}`;
        }

        switch (type) {
            case 'toggle':
                Component = (
                    <Switch
                        {...widgetProps}
                        key       = {`switch${id}`}
                        className = {styles.toggle}
                        value     = {value === 'true'}
                        variant   = {'secondary'}
                    />
                );
                break;
            case 'thermostat':
                return (
                    <Thermostat
                        {...widgetProps}
                        key          = {`thermostat${id}`}
                        advanced = {advanced}
                        dataType = {dataType}
                    />
                );
            case 'pushButton':
                Component = (
                    <PushButton
                        {...widgetProps}
                        key       = {`pushButton${id}`}
                        className = {styles.pushButton}
                        onClick   = {useCallback(() => handleChangeField({ value: 'true' }, []))}
                    />
                );
                break;
            case 'enum':
                Component = (
                    <List
                        {...widgetProps}
                        key            = {`enum${id}`}
                        onToggleMenu   = {handleToggleMenu}
                        isSettable     = {isSettable}
                        options        = {useMemo(() => format?.split(',').map(option => ({ value: option, label: option })), [ format ])}
                        valueClassName = {styles.value}
                        menuYOffset    = {phoneMode === 'android' ? 6 : void 0}
                        portalId       = {LAYOUT_CONTENT_ID}
                        maxWidth       = {valueFieldWidth}
                    />
                );
                break;
            case 'color':
                Component = (
                    <ColorPickerPreview
                        {...widgetProps}
                        key  = {`color${id}`}
                        type = {format || void 0}
                    />
                );
                break;
            case 'switcher':
                Component = (
                    <Switcher
                        {...widgetProps}
                        key       = {`switcher${id}`}
                        options   = {useMemo(() => format?.split(','), [ format ])}
                    />
                );
                break;
            case 'inlineInput':
                return (
                    <Base
                        {...widgetProps}
                        key            = {`inlineInput${id}`}
                        value          = {value || EMPTY_TEXT}
                        unit           = {advanced?.unit}
                        isSettable     = {isSettable}
                        type           = {dataType}
                        maxWidths      = {{
                            value : advanced?.unit ? 'calc(100% - 22px)' : '100%',
                            unit  : '22px'
                        }}
                        classes        = {{
                            value      : cx(styles.value, styles.inlineStringValue),
                            valueField : styles.valueField,
                            inputField : styles.inputField,
                            inputBtn   : styles.inputBtn,
                            unit       : styles.unit
                        }}
                        inputProps     = {{ placeholder: '' }}
                        isAutoHideUnit
                    />);
            case 'slider':
                return (
                    <Slider
                        {...widgetProps}
                        key   = {`slider${id}`}
                        advanced = {advanced}
                    />
                );
            case 'led':
                return (
                    <Led
                        key         = {`led${id}`}
                        activeColor = {advanced?.activeColor?.color}
                        isActive    = {value === 'true'}
                        t           = {t}
                    />
                );
            case 'bulb':
                return !isMultipleTopics
                    ? (
                        <Bulb
                            {...widgetProps}
                            key          = {`bulb${id}`}
                            value        = {value === 'true'}
                            isProcessing = {isProcessing}
                            isSettable   = {isSettable}
                            t            = {t}
                        />
                    ) : (
                        <CriticalValue
                            key        = {`default${id}`}
                            className  = {cx(styles.value)}
                            value      = {getMultipltBulbValue() || EMPTY_TEXT}
                            maxWidth   = {'68px'}
                            isDisabled = {false}
                        />
                    );
            case 'twoWayButton':
                return (
                    <TwoWayButton
                        {...widgetProps}
                        key        = {`twoWayButton${id}`}
                        value      = {value === 'true'}
                        isSettable = {isSettable}
                    />
                );
            case 'tumbler':
                return (
                    <Tumbler
                        {...widgetProps}
                        key        = {`tumbler${id}`}
                        value      = {value === 'true'}
                        isSettable = {isSettable}
                    />
                );
            case 'signalLevel':
                return (
                    <SignalLevel
                        {...widgetProps}
                        key        = {`signalLevel${id}`}
                        advanced   = {advanced}
                        t          = {t}
                    />
                );
            case 'battery':
                return (
                    <Battery
                        {...widgetProps}
                        key        = {`battery${id}`}
                        advanced   = {advanced}
                        t          = {t}
                    />
                );
            case 'door':
                return (
                    <Door
                        {...widgetProps}
                        value      = {value === 'true'}
                        key        = {`door${id}`}
                        t          = {t}
                    />
                );
            case 'timePicker':
                return (
                    <TimePicker
                        {...widgetProps}
                        key        = {`timePicker${id}`}
                        t          = {t}
                    />
                );
            case 'motionSensor':
                return (
                    <MotionSensor
                        {...widgetProps}
                        key         = {`motionSensor${id}`}
                        isActive    = {value === 'true'}
                        t           = {t}
                    />
                );
            case 'text':
                return (
                    <TextControl
                        {...widgetProps}
                        unit = {advanced?.unit}
                        key = {`text${id}`}
                        t   = {t}
                    />
                );
            default:
                Component = (
                    <CriticalValue
                        {...widgetProps}
                        key        = {`default${id}`}
                        className  = {cx(styles.value, {
                            withPadding : (!advanced?.unit && withEditScreen && !settable && !isDeviceDisabled)
                        })}
                        value      = {value || EMPTY_TEXT}
                        maxWidth   = {valueFieldWidth}
                        isDisabled = {false}
                    />
                );
                break;
        }

        const withoutUnit = [ 'toggle' ]?.includes(type);

        return (
            <>
                {Component}
                {advanced?.unit && !withoutUnit
                    ? (
                        <CriticalValue
                            className  = {styles.unit}
                            value      = {advanced?.unit}
                            maxWidth   = {'22px'}
                            isDisabled = {!isBrokerConnected}
                        />
                    ) : null
                }
            </>
        );
    }

    function renderDescription() {
        const isValueUnderDescription = [ 'text' ].includes(type);

        return (
            <div
                className={cx(styles.descriptionWrapper, {
                    notEditable : !isEditMode,
                    withValue   : !!isValueUnderDescription
                })}>
                <CriticalValue
                    className  = {styles.nameField}
                    value      = {name}
                    isDisabled = {!isBrokerConnected}
                />
                { isValueUnderDescription
                    ? <div className={styles.valueField}>
                        <CriticalValue
                            value      = {value}
                            isDisabled = {!isBrokerConnected}
                        />
                        <CriticalValue
                            value      = {advanced?.unit}
                            maxWidth   = {'22px'}
                            isDisabled = {!isBrokerConnected}
                        />
                    </div>
                    : null
                }
            </div>
        );
    }

    function deleteFromLocalData(widgetId) {
        const localSettingsData = localStorageUtils.getData(TIMELINE_WIDGET_DATA) || {};

        if (localSettingsData?.[widgetId]) delete localSettingsData?.[widgetId];
        localStorageUtils.saveData(TIMELINE_WIDGET_DATA, localSettingsData);
    }

    function handleDeleteWidget() {
        openModal('confirm', {
            onSubmit : () => {
                onDelete(id);
                deleteFromLocalData(id);
                closeModal('confirm');
                // addToast({
                //     key     : TOASTS_KEYS.widgetUpdate,
                //     title   : 'Success',
                //     message : 'Widget has been deleted',
                //     type    : 'success'
                // });
            },
            onCancel : () => {
                closeModal('confirm');
            },
            title   : t('layout-page:Delete widget', { name }),
            message : t('layout-page:Are you sure you want to delete this widget?'),
            size    : 'L'
        });
    }

    function handleEditWidget() {
        openModal('layoutWidget', {
            isCreateEntity : false,
            deviceId,
            entityData     : { ...widgetData, topics },
            onSuccess      : (widget) => {
                onChange(widget?.id, widget);
            }
        });
    }

    function handleOpenWidgetScreen() {
        if (openWidgetScreen && isSettable || withReadOnlyScreen || isMultipleTopics) {
            openWidgetScreen({ ...widgetData, dataType, topics });
        }
    }

    const widgetCN = cx(styles.Widget, {
        [type]                : type,
        [`${themeMode}Theme`] : themeMode,
        withEditScreen        : withEditScreen || withReadOnlyScreen || isMultipleTopics
    });

    return (
        <div className={widgetCN}>
            { isEditMode
                ? (
                    <div className={styles.controlsWrapper}>
                        <Tooltip
                            title      = {t('translation:Edit')}
                            classes    = {{ tooltip: styles.tooltip }}
                            isDisabled = {!isBrokerConnected}
                        >
                            <div>
                                <IconButton
                                    iconType  = 'edit'
                                    className = {cx(styles.control, styles.editControl)}
                                    onClick   = {isBrokerConnected ? handleEditWidget : void 0}
                                />
                            </div>
                        </Tooltip>

                        <Tooltip
                            title      = {t('translation:Delete')}
                            classes    = {{ tooltip: styles.tooltip }}
                            isDisabled = {!isBrokerConnected}
                        >
                            <div>
                                <IconButton
                                    iconType  = 'bin'
                                    className = {cx(styles.control, styles.deleteControl)}
                                    onClick   = {isBrokerConnected ? handleDeleteWidget : void 0}
                                />
                            </div>
                        </Tooltip>
                    </div>
                ) : null
            }
            {renderDescription()}
            <div
                className={cx(styles.valueWrapper, {
                    notEditable    : !isSettable,
                    withoutPointer : !isSettable && !withReadOnlyScreen && !isMultipleTopics,
                    withProcessing : withEditScreen || !isMultipleTopics,
                    processing     : isProcessing && !isMultipleTopics,
                    [type]         : type,
                    withoutPadding : (withEditScreen && !isDeviceDisabled)
                        || withReadOnlyScreen || isMultipleTopics,
                    withUnit : advanced?.unit
                })}
            >
                <div
                    className = {styles.fieldsWrapper}
                    onClick   = {
                        isBrokerConnected && withEditScreen && isSettable && !isProcessing
                        || (!isProcessing && withReadOnlyScreen)
                        || (isMultipleTopics)
                            ? handleOpenWidgetScreen
                            : void 0
                    }
                >
                    {renderValue()}

                    { isSettable && withEditScreen && !isProcessing ||
                    (!isProcessing && withReadOnlyScreen) ||
                    (isMultipleTopics)
                        ? (
                            <Tooltip
                                title      = {withReadOnlyScreen ? t('layout-page:Show widget') : t('layout-page:Edit widget')}
                                classes    = {{ tooltip: styles.tooltip }}
                                isDisabled = {!isBrokerConnected}
                            >
                                <div>
                                    <IconButton
                                        iconType  = 'arrowRightThin'
                                        className = {cx(styles.control, styles.editValueControl)}
                                    />
                                </div>
                            </Tooltip>
                        ) : null
                    }

                    { isProcessing && !isMultipleTopics && (withEditScreen || withReadOnlyScreen)
                        ? (
                            <div className={styles.loaderWrapper}>
                                <CircularProgress
                                    color={'greyDark'}
                                />
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div>
    );
}

Widget.propTypes = {
    id                : PropTypes.string.isRequired,
    name              : PropTypes.string.isRequired,
    value             : PropTypes.string.isRequired,
    values            : PropTypes.array,
    phoneMode         : PropTypes.string,
    themeMode         : PropTypes.string,
    isBrokerConnected : PropTypes.bool,
    openWidgetScreen  : PropTypes.func.isRequired,
    type              : PropTypes.oneOf([
        'input',
        'string',
        'integer',
        'toggle',
        'enum',
        'thermostat',
        'pushButton',
        'color',
        'switcher',
        'inlineInput',
        'gauge',
        'led',
        'bulb',
        'twoWayButton',
        'tumbler',
        'signalLevel',
        'battery',
        'door',
        'slider',
        'number',
        'text'
    ]).isRequired,
    dataType : PropTypes.string,
    format   : PropTypes.string,
    advanced : PropTypes.shape({
        step : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
        min  : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
        max  : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
    }),
    onDelete          : PropTypes.func.isRequired,
    openModal         : PropTypes.func.isRequired,
    closeModal        : PropTypes.func.isRequired,
    setWidgetValue    : PropTypes.func.isRequired,
    setIsDragDisabled : PropTypes.func.isRequired,
    onChange          : PropTypes.func.isRequired,
    t                 : PropTypes.func,
    isEditMode        : PropTypes.bool,
    settable          : PropTypes.bool.isRequired,
    topics            : PropTypes.arrayOf(PropTypes.string),
    widgetTopic       : PropTypes.string,
    isProcessing      : PropTypes.bool,
    isDeviceDisabled  : PropTypes.bool,
    deviceId          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
};

Widget.defaultProps = {
    advanced          : void 0,
    topics            : [],
    values            : [],
    widgetTopic       : '',
    phoneMode         : '',
    themeMode         : '',
    isDeviceDisabled  : false,
    isEditMode        : false,
    isBrokerConnected : false,
    isProcessing      : false,
    dataType          : '',
    format            : '',
    deviceId          : void 0,
    t                 : (text) => text
};

export default React.memo(Widget);

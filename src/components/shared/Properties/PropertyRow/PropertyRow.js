import React, {
    PureComponent
}                             from 'react';
import PropTypes              from 'prop-types';
import classnames             from 'classnames/bind';

import { getPropertyUnit }    from 'templater-ui/src/utils/homie/index.js';
import Switch                 from 'templater-ui/src/components/base/Switch';
import Tooltip                from 'templater-ui/src/components/base/Tooltip';
import IconButton             from 'templater-ui/src/components/base/IconButton';
import CriticalValue          from 'templater-ui/src/components/base/CriticalValue';
import CopyTextButton         from 'templater-ui/src/components/base/CopyTextButton';
import PushButton             from 'templater-ui/src/components/base/Button/PushButton/PushButton';

import { TOASTS_KEYS }        from 'Constants/toasts';
import EnumControl            from 'Base/controls/Enum';
import FloatControl           from 'Base/controls/Float';
import StringControl          from 'Base/controls/String';
import IntegerControl         from 'Base/controls/Integer';

import {
    PROPERTIES_LIST_ID
}                             from '../data.js';

import styles                 from './PropertyRow.less';

const cx = classnames.bind(styles);

class PropertyRow extends PureComponent {
    static propTypes = {
        unit      : PropTypes.string,
        name      : PropTypes.string,
        readerId  : PropTypes.string,
        settable  : PropTypes.string,
        retained  : PropTypes.string,
        dataType  : PropTypes.string,
        format    : PropTypes.string,
        rootTopic : PropTypes.string,
        id        : PropTypes.string.isRequired,
        isDisable : PropTypes.bool,
        classes   : PropTypes.shape({
            root     : PropTypes.string,
            mainData : PropTypes.string,
            value    : PropTypes.string
        }),
        setAttribute              : PropTypes.func.isRequired,
        addToast                  : PropTypes.func.isRequired,
        addDisplayedTopic         : PropTypes.func.isRequired,
        deleteDisplayedTopic      : PropTypes.func.isRequired,
        value                     : PropTypes.string,
        isValueProcessing         : PropTypes.bool,
        withCopyControl           : PropTypes.bool,
        title                     : PropTypes.string,
        accessTokenReaderId       : PropTypes.string,
        displayedTopics           : PropTypes.array,
        propertyIdsWithVisibility : PropTypes.array,
        renderCustomComponent     : PropTypes.func,
        t                         : PropTypes.func.isRequired
    }

    static defaultProps = {
        value             : '—',
        unit              : '#',
        readerId          : '',
        name              : '—',
        settable          : 'false',
        retained          : 'true',
        dataType          : 'string',
        format            : '',
        rootTopic         : '',
        isDisable         : false,
        title             : '',
        isValueProcessing : false,
        withCopyControl   : false,
        classes           : {
            root     : '',
            mainData : '',
            value    : ''
        },
        accessTokenReaderId       : '',
        displayedTopics           : [],
        propertyIdsWithVisibility : [],
        renderCustomComponent     : void 0
    }

    constructor(props) {
        super(props);

        this.state = {
            isValueError : false
        };
    }

    handleInteract = () => {
        const { isValueError } = this.state;

        if (isValueError) this.setState({ isValueError: false });
    }

    handleChangeValueByTopic = ({ value, onSuccess, onError } = {}) => {
        const { rootTopic, setAttribute, addToast, t } = this.props;
        const { isValueError } = this.state;

        if (isValueError) this.setState({ isValueError: false });

        setAttribute({
            topic     : rootTopic,
            field     : 'value',
            value,
            onSuccess : () => {
                if (onSuccess) onSuccess();
            },
            onError : () => {
                if (onError) onError();
                this.setState({ isValueError: true });

                addToast({
                    key     : TOASTS_KEYS.devicePropertyValue,
                    title   : t('toasts:Something went wrong'),
                    message : t('toasts:The value was not set'),
                    type    : 'error'
                });
            }
        });
    }

    handlePushButtonClick = () => {
        this.handleChangeValueByTopic({ value: 'true' });
    }

    handleChangeDisplayedTopic = () =>  {
        const { displayedTopics, rootTopic, deleteDisplayedTopic, addDisplayedTopic, accessTokenReaderId } = this.props;

        const isVisible = displayedTopics.includes(rootTopic);

        if (isVisible)  {
            deleteDisplayedTopic({
                topic : rootTopic,
                accessTokenReaderId
            });
        } else {
            addDisplayedTopic({
                topic : rootTopic,
                accessTokenReaderId
            });
        }
    }

    renderProperty = ({ id, title }) => {
        const { displayedTopics, rootTopic, propertyIdsWithVisibility, t } = this.props;
        const withVisibility = propertyIdsWithVisibility?.includes(id);
        const isVisible = displayedTopics.includes(rootTopic);

        return (
            <div className={styles.property}>
                <CriticalValue
                    className = {styles.propertyName}
                    value     = {title}
                />

                {
                    withVisibility ?
                        <Tooltip
                            title = {
                                isVisible
                                ? t('readers-page:Hide option')
                                : t('readers-page:Show option')
                            }
                        >
                            <div>
                                <IconButton
                                    className = {styles.propertyVisibility}
                                    iconType  = {isVisible ? 'visible' : 'invisible'}
                                    size      = 'S'
                                    onClick   = {this.handleChangeDisplayedTopic}
                                />
                            </div>
                        </Tooltip>
                        : null
                }
            </div>
        );
    }

    renderControls = (dataType, props = {}) => {    // eslint-disable-line
        const {
            isValueProcessing, settable, t, withCopyControl, retained
        } = this.props;
        const { isValueError } = this.state;

        switch (dataType) {
            case 'float':
                return (
                    <FloatControl
                        {...props}
                        onChange      = {this.handleChangeValueByTopic}
                        isError       = {isValueError}
                        isProcessing  = {isValueProcessing}
                        onInteract    = {this.handleInteract}
                    />
                );
            case 'boolean':
                return retained === 'true' ? (
                    <Switch
                        className    = {styles.switchControl}
                        value        = {props?.value === 'true'}
                        isDisabled   = {settable === 'false'}
                        onChange     = {this.handleChangeValueByTopic}
                        isProcessing = {isValueProcessing}
                    />
                ) : (
                    <PushButton
                        className    = {styles.pushButtonControl}
                        onClick      = {this.handlePushButtonClick}
                        isProcessing = {isValueProcessing}
                    />
                );
            case 'enum':
                return (
                    <EnumControl
                        {...props}
                        onChange      = {this.handleChangeValueByTopic}
                        isError       = {isValueError}
                        isProcessing  = {isValueProcessing}
                        onInteract    = {this.handleInteract}
                        withKeyboard  = {false}
                    />
                );
            case 'string':
                return (
                    <>
                        <StringControl
                            {...props}
                            onChange        = {this.handleChangeValueByTopic}
                            isError         = {isValueError}
                            isProcessing    = {isValueProcessing}
                            onInteract      = {this.handleInteract}
                            withCopyControl = {withCopyControl}
                        />
                        { withCopyControl
                            ? (
                                <CopyTextButton
                                    text      = {props.value}
                                    className = {styles.copyTextButton}
                                    t         = {t}
                                    variant   = 'simple'
                                    color     = {'primary500'}
                                    portalId  = {PROPERTIES_LIST_ID}
                                />
                            ) : null
                        }
                    </>
                );
            case 'integer':
                return (
                    <IntegerControl
                        {...props}
                        onChange      = {this.handleChangeValueByTopic}
                        isError       = {isValueError}
                        isProcessing  = {isValueProcessing}
                        onInteract    = {this.handleInteract}
                    />
                );
            // case 'color':
            //     return (
            //         <ColorControl
            //             {...props}
            //             onChange      = {this.handleChangeValueByTopic}
            //             propertyId    = {propertyId}
            //             isProcessing  = {isValueProcessing}
            //             isError       = {isValueError}
            //             onErrorRemove = {this.handleRemoveError}
            //         />
            //     );
            default:
                return (
                    <CriticalValue
                        value     = {props.value}
                        className = {styles.defaultValue}
                    />
                );
        }
    }

    renderContent() {
        const {
            id,
            name,
            unit,
            format,
            dataType,
            value,
            settable,
            retained,
            title,
            renderCustomComponent,
            isValueProcessing,
            rootTopic,
            classes
        } = this.props;
        const { value: valueStyles } = classes;
        const propertyTitle = title || name || '—';

        // <Text
        //     className = {styles.propertyName}
        //     text      = {propertyTitle}
        // />

        return (
            <>
                <div className={cx('cell', 'name')}>
                    {
                        this.renderProperty({ id, title: propertyTitle })
                    }
                </div>
                <div className={cx('cell', 'value', { [valueStyles]: valueStyles })}>
                    {renderCustomComponent ?
                        renderCustomComponent({ readerName : name,
                                                topic      : rootTopic,
                                                value,
                                                isValueProcessing })
                    : this.renderControls(
                        dataType,
                        {
                            value      : value || '—',
                            unit       : getPropertyUnit(unit),
                            isSettable : settable === 'true',
                            isRetained : retained === 'true',
                            options    : format
                        }
                    )}
                </div>
            </>
        );
    }

    render() {
        const { classes } = this.props;
        const propertyRowCN = cx(styles.PropertyRow, {
            [classes?.root] : classes?.root
        });

        return (
            <div className={propertyRowCN}>
                <div className={cx(styles.mainData, { [classes?.mainData]: classes?.mainData })}>
                    { this.renderContent() }
                </div>
            </div>
        );
    }
}

export default PropertyRow;

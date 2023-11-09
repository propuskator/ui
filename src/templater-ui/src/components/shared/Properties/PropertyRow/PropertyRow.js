import React, {
    PureComponent
}                             from 'react';
import PropTypes              from 'prop-types';
import classnames             from 'classnames/bind';

import { getPropertyUnit }    from './../../../../utils/homie';
import { TOASTS_KEYS }        from './../../../../constants/toasts';
import CriticalValue          from './../../../base/CriticalValue';
import Switch                 from './../../../base/Switch';
import EnumControl            from './../../../base/controls/Enum';
import FloatControl           from './../../../base/controls/Float';
import StringControl          from './../../../base/controls/String';
import IntegerControl         from './../../../base/controls/Integer';

import styles                 from './PropertyRow.less';

const cx = classnames.bind(styles);

class PropertyRow extends PureComponent {
    static propTypes = {
        unit      : PropTypes.string,
        name      : PropTypes.string,
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
        setAttribute      : PropTypes.func.isRequired,
        addToast          : PropTypes.func.isRequired,
        value             : PropTypes.string,
        isValueProcessing : PropTypes.bool,
        title             : PropTypes.string
    }

    static defaultProps = {
        value             : '—',
        unit              : '#',
        name              : '—',
        settable          : 'false',
        retained          : 'true',
        dataType          : 'string',
        format            : '',
        rootTopic         : '',
        isDisable         : false,
        title             : '',
        isValueProcessing : false,
        classes           : {
            root     : '',
            mainData : '',
            value    : ''
        }
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
        const { rootTopic, setAttribute, addToast } = this.props;
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
                    title   : 'Что-то пошло не так',
                    message : 'Значение не было установлено',
                    type    : 'error'
                });
            }
        });
    }

    renderControls = (dataType, props = {}) => {    // eslint-disable-line
        const {
            isValueProcessing, isDisable
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
                return (
                    <Switch
                        className    = {styles.switchControl}
                        value        = {props?.value === 'true'}
                        disabled     = {isDisable}
                        onChange     = {this.handleChangeValueByTopic}
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
                    />
                );
            case 'string':
                return (
                    <StringControl
                        {...props}
                        onChange      = {this.handleChangeValueByTopic}
                        isError       = {isValueError}
                        isProcessing  = {isValueProcessing}
                        onInteract    = {this.handleInteract}
                    />
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
            name,
            unit,
            format,
            dataType,
            value,
            settable,
            retained,
            title,
            classes
        } = this.props;
        const { value: valueStyles } = classes;
        const propertyTitle = title || name || '—';

        return (
            <>
                <div className={cx('cell', 'name')}>
                    <CriticalValue
                        value     = {propertyTitle}
                        className = {styles.propertyName}
                    />
                </div>
                <div className={cx('cell', 'value', { [valueStyles]: valueStyles })}>
                    {this.renderControls(
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

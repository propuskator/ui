/* eslint-disable babel/no-unused-expressions */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
// import { v4 as uuidv4 }      from 'uuid';

import globalEnterHandler       from '../../../utils/eventHandlers/globalEnterHandler';
import Typography               from '../../base/Typography';
import InputCopyText            from '../../base/Input/InputCopyText';
import AvatarFormField          from '../../base/Avatar/AvatarFormField';
import SwitchFormField          from '../../base/Switch/SwitchFormField';
import Editor                   from '../../base/Editor';
import Input                    from '../../base/Input';
import InputPassword            from '../../base/Input/InputPassword';
import InputPasswordStrength    from '../../base/Input/InputPasswordStrength';
import InputPhone               from '../../base/Input/InputPhone';
import InputNumber              from '../../base/Input/InputNumber';
import InputInfo                from '../../base/Input/InputInfo';
import StringControl            from '../../base/controls/String';
import Dropdown                 from '../../base/Dropdown';
import AsyncDropdown            from '../../base/Dropdown/AsyncDropdown';
import DropdownTimezone         from '../../base/Dropdown/DropdownTimezone';
import DropdownLanguages        from '../../base/Dropdown/DropdownLanguages';
import ColorSelect              from '../../base/ColorSelect';
import CopyTextButton           from '../../base/CopyTextButton';
import CheckboxSquared          from '../../base/Checkbox/CheckboxSquared';
import ErrorMessage             from '../../base/ErrorMessage';
import FormControls             from '../FormControls';

import { isFunction }           from '../../../utils/typeCheck';

import styles            from './CustomForm.less';

const cx = classnames.bind(styles);

const VALIDATION_ERRORS_MAP = {
    'Failed to fetch' : 'Server error',
    'REQUIRED'        : 'Value is required',
    'FORMAT_ERROR'    : 'Format error'
    // 'CANNOT_BE_EMPTY'      : 'Value cannot be empty',
    // 'NOT_ALLOWED_VALUE'    : 'Given value is not allowed',
    // 'TOO_LONG'             : 'Value is too long',
    // 'TOO_SHORT'            : 'Value is too short',
    // 'WRONG_FORMAT'         : 'Value has a wrong format',
    // 'WRONG_NAME'           : 'Latin lowercase letters only: from "a" to "z" and numbers from "0" to "9"',
    // 'NOT_INTEGER'          : 'Should be integer',
    // 'NOT_POSITIVE_INTEGER' : 'Should be positive integer',
    // 'NOT_DECIMAL'          : 'Should be decimal',
    // 'NOT_POSITIVE_DECIMAL' : 'Should be positive decimal',
    // 'TOO_HIGH'             : 'Value is too high',
    // 'TOO_LOW'              : 'Value is too low',
    // 'NOT_NUMBER'           : 'Value is not a number',
    // 'EXISTS'               : 'Value should be unique'
};

class CustomForm extends PureComponent {
    static propTypes = {
        configuration : PropTypes.shape({
            name     : PropTypes.string.isRequired,
            title    : PropTypes.string,
            fields   : PropTypes.array.isRequired,
            controls : PropTypes.shape({
                cancel : PropTypes.shape({
                    title : PropTypes.string.isRequired
                }),
                submit : PropTypes.shape({
                    title : PropTypes.string.isRequired
                })
            })
        }).isRequired,
        initialState     : PropTypes.object,
        className        : PropTypes.string,
        errors           : PropTypes.object,
        commonError      : PropTypes.string,
        isProcessing     : PropTypes.bool,
        processingFields : PropTypes.array,
        withCommonError  : PropTypes.bool,
        onInteract       : PropTypes.func,
        onSubmit         : PropTypes.func,
        onCancel         : PropTypes.func,
        formatter        : PropTypes.func,
        onChangeField    : PropTypes.func,
        forwardRef       : PropTypes.shape({ current: PropTypes.object }),
        classes          : PropTypes.shape({
            form     : PropTypes.string,
            fieldSet : PropTypes.string
        }),
        fieldsMap           : PropTypes.shape({}),
        checkValidOnSubmit  : PropTypes.bool,
        alwaysSubmitOnOnter : PropTypes.bool,
        t                   : PropTypes.func
    }

    static defaultProps = {
        initialState        : {},
        errors              : {},
        className           : '',
        commonError         : '',
        isProcessing        : false,
        processingFields    : [],
        withCommonError     : false,
        onCancel            : void 0,
        onSubmit            : void 0,
        onInteract          : void 0,
        forwardRef          : void 0,
        formatter           : void 0,
        onChangeField       : void 0,
        classes             : {},
        fieldsMap           : {},
        checkValidOnSubmit  : true,
        alwaysSubmitOnOnter : false,
        t                   : (text) => text
    }

    constructor(props) {
        super(props);
        const { initialState, forwardRef } = props;

        this.state = {
            fields          : initialState,
            validation      : {},
            forceUpdateHack : 0
        };

        if (forwardRef && 'current' in forwardRef) {
            forwardRef.current = {
                getValue : () => this.state.fields,
                refresh  : () => this.setState({
                    forceUpdateHack : this.state.forceUpdateHack + 1
                }),
                setValue      : this.handleChangeField,
                setFormData   : this.handleSetFormData,
                patchFormData : (patch = {}) => {
                    this.setState({
                        fields : {
                            ...this.state.fields,
                            ...patch
                        }
                    });
                }
            };
        }
    }

    componentDidMount() {
        const { alwaysSubmitOnOnter } = this.props;

        globalEnterHandler.register(this.submitOnEnter, { alwaysTrigger: alwaysSubmitOnOnter });
    }

    componentWillUnmount() {
        globalEnterHandler.unregister(this.submitOnEnter);
    }

    getError(code) {
        if (!code) return;
        if (Object.prototype.toString.call(code) === '[object Object]') return code;

        const text = this.props.t(VALIDATION_ERRORS_MAP[code]);

        if (text) return text;
        const fallbackText = code.replace('_', ' ');

        return `${fallbackText.charAt(0).toUpperCase()}${fallbackText.slice(1)}`;
    }

    handleCancel = e => {
        if (e) e.preventDefault();

        const { onCancel } = this.props;

        if (onCancel) onCancel();
    }

    handleSetValidation = ({ name, value } = {}) => {
        const { validation } = this.state;

        if (validation[name] === value) return;

        this.setState(prevState => ({
            validation : {
                ...prevState.validation,
                [name] : value
            }
        }));
    }

    handleSubmit = async e => {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        if (this.props.isProcessing) return;

        try {
            const { onSubmit, checkValidOnSubmit } = this.props;
            const isValid = this.checkIsValid();

            if (checkValidOnSubmit && !isValid) return;
            if (onSubmit) await onSubmit(this.state.fields);
        } catch (error) {
            console.error('handle submit error: ', error);
            // pass
        }
    }

    handleChangeField = ({ name, value, onSuccess, onError }) => {
        const { onInteract, formatter, onChangeField, processingFields } = this.props;

        if (processingFields?.includes(name)) return;

        const processValue = formatter ? formatter({ name, value }) : value;

        this.setState(prevState => ({
            fields : {
                ...prevState.fields,
                [name] : processValue
            }
        }));

        if (onInteract) onInteract(name);

        if (onChangeField) {
            return onChangeField({
                name,
                value   : processValue,
                onError : ({ prevValue } = {}) => {
                    if (onError) onError();

                    this.setState(prevState => ({
                        fields : {
                            ...prevState.fields,
                            [name] : prevValue
                        }
                    }));
                },
                onSuccess
            });
        }
    }

    handleSetFormData = (fields) => {
        this.setState({ fields });
    }

    submitOnEnter = (e) => {
        const { target } = e;
        const formsList = [ ...document.getElementsByTagName('form') ];

        const isFormSubmit = formsList.length > 1
            ? this.formRef?.contains(e.target)
            : true;

        if (!isFormSubmit) return;
        // if (this.isEdit) return;
        if ([ 'BUTTON', 'A' ].includes(target.nodeName)) {
            if (target.classList.contains('abort-submit')) return;
        }
        if (target.id === 'select--opened') return;

        this.handleSubmit(e);
    }

    checkIsValid() {
        const { errors } = this.props;
        const { validation } = this.state;

        const isErrorsFromProps = !!Object.values(errors || {}).find(error => !!error);
        const isValidationError = !!Object.values(validation || {}).find(error => !!error);

        return !isErrorsFromProps && !isValidationError;
    }

    renderField(field) {
        const { fieldsMap, errors } = this.props;
        const { fields = [] } = this.state;
        const CustomField = fieldsMap[field?.type];

        if (CustomField) {
            return this.renderBaseField(field, CustomField);
        }

        switch (field?.type) {
            case 'string':
                return this.renderBaseField(field, Input);
            case 'inputWithInfo':
                return this.renderBaseField(field, InputInfo);
            case 'asyncString':
            case 'stringControl':
                return this.renderStringControl(field);
            case 'integer':
            case 'float':
                return this.renderBaseField(field, InputNumber);
            case 'password':
                return this.renderBaseField(field, InputPassword);
            case 'passwordStrength':
                return this.renderInputPasswordStrength(field);
            case 'dropdown':
                return this.renderBaseField(field, Dropdown);
            case 'dropdownTimezone':
                return this.renderBaseField(field, DropdownTimezone);
            case 'dropdownLanguages':
                return this.renderBaseField(field, DropdownLanguages);
            case 'asyncDropdown':
                return this.renderBaseField(field, AsyncDropdown);
            case 'avatar':
                return this.renderBaseField(field, AvatarFormField);
            case 'phone':
                return this.renderBaseField(field, InputPhone);
            case 'switch':
                return this.renderBaseField(field, SwitchFormField);
            case 'copyText':
                return this.renderCopyText(field);
            case 'editor':
                return this.renderBaseField(field, Editor, { withValidation: true });
            case 'colorSelect':
                return this.renderColorSelect(field);
            case 'checkboxSquared':
                return this.renderCheckboxSquared(field);
            case 'customField':
                return field?.renderCustomField({
                    ...field?.props,
                    isProcessing : !!this.props?.isProcessing,
                    name         : field?.name,
                    onChange     : this.handleChangeField,
                    value        : fields[field?.name] || field?.defaultValue || '',
                    errorText    : this.getError(errors?.[field.name])
                });
            default:
                return null;
        }
    }

    renderBaseField(field, Component, options = {}) {
        const { errors, processingFields, t } = this.props;
        const { fields = [] } = this.state;
        const { name, title, label, placeholder, type, className, defaultValue } = field || {};
        const errorText = this.getError(errors?.[field.name]);
        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [type]      : type,
            [className] : className
        });
        const isProcessing = !!this.props?.isProcessing || !!processingFields?.includes(name);

        const additionalProps = {
            ...(options?.withValidation ? { onSetValidation: this.handleSetValidation } : {})
        };

        return (
            <div key={name} className={fieldWrapperCN}>
                { title
                    ? (
                        <Typography variant='headline4' className={cx(styles.fieldTitle, { processing: isProcessing })}>
                            {title}
                        </Typography>
                    )
                    : null
                }
                <Component
                    key             = {`${name}${isProcessing}`}
                    value           = {fields[name] || defaultValue || ''}
                    name            = {name}
                    label           = {label}
                    placeholder     = {placeholder}
                    onChange        = {this.handleChangeField}
                    errorMessage    = {errorText}
                    isInvalid       = {!!errorText}
                    disabled        = {isProcessing}
                    isProcessing    = {isProcessing}
                    t               = {t}
                    {...additionalProps}
                    {...(field?.props || {})}
                />
            </div>
        );
    }

    renderInputPasswordStrength = field => {
        const { fields = [] } = this.state;
        const { observeFields = [], extraDictionary = [], ...restProps } = field.props || {};

        const userInputs = [ ...observeFields?.map(fieldName => fields[fieldName]), ...(extraDictionary || []) ];
        const extendedField = { ...field, props: { ...restProps, userInputs } };

        return this.renderBaseField(extendedField, InputPasswordStrength);
    }

    renderCopyText = (field) => {
        const { t } = this.props;
        const { name, title, label, text, type, className } = field || {};
        const isProcessing = !!this.props?.isProcessing;
        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [type]                  : type,
            [className]             : className,
            processing              : isProcessing,
            [field?.props?.variant] : field?.props?.variant
        });

        return (
            <div key={name + title} className={fieldWrapperCN}>
                { title
                    ? (
                        <Typography
                            variant   = {'headline4'}
                            className = {styles.fieldTitle}
                        >
                            {title}

                            { field?.props?.hideCopyButton
                                ? (
                                    <CopyTextButton
                                        text      = {text || '-'}
                                        className = {styles.copyTextButton}
                                        t         = {t}
                                    />
                                ) : null
                            }
                        </Typography>
                    ) : null
                }
                <InputCopyText
                    className      = {styles.value}
                    value          = {text || ''}
                    label          = {label}
                    variant        = 'simple'
                    t              = {t}
                    {...(field?.props || {})}
                />
            </div>
        );
    }

    renderStringControl = (field) => {
        const { errors, onInteract, processingFields } = this.props;
        const { fields = [] } = this.state;
        const { name, type, className, title, defaultValue } = field || {};
        const errorText = this.getError(errors?.[name]);
        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [type]      : type,
            [className] : className
        });
        const isProcessing = this.props?.isProcessing || processingFields?.includes(name);

        return (
            <div key={field.name + field.label} className={fieldWrapperCN}>
                { title
                    ? (
                        <Typography variant='headline4' className={cx(styles.fieldTitle, { processing: isProcessing })}>
                            {title}
                        </Typography>
                    )
                    : null
                }
                <StringControl
                    name          = {name}
                    value         = {fields[name] || defaultValue || ''}
                    onChange      = {this.handleChangeField}
                    classes       = {{
                        valueField  : styles.valueField,
                        formWrapper : styles.formWrapper
                    }}
                    isSettable    = {!isProcessing}
                    isInvalid     = {!!errorText}
                    onInteract    = {onInteract}
                    isProcessing  = {!!isProcessing}
                    errorMessage  = {errorText}
                    {...(field?.props || {})}
                />
            </div>
        );
    }

    renderColorSelect = field => {
        const { fields = [] } = this.state;
        const { errors, t } = this.props;
        const { name, type, label, className, defaultValue, props } = field || {};

        const errorText = this.getError(errors?.[name]);

        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [type]      : type,
            [className] : className
        });

        return (
            <div key={field.name + field.label} className={fieldWrapperCN}>
                <div className={styles.colorSelectWrapper}>
                    <Typography
                        className = {styles.colorSelectTitle}
                        variant   = 'body1'
                        color     = 'black'
                    >
                        {t(label)}
                    </Typography>

                    <ColorSelect
                        className={styles.colorSelect}
                        colors = {props?.colors}
                        activeColorId={fields[name]?.id || defaultValue?.id || ''}
                        // eslint-disable-next-line react/jsx-no-bind
                        onChangeColor={colorObj => this.handleChangeField({ name, value: colorObj })}
                    />
                </div>
                <ErrorMessage error={errorText} />
            </div>
        );
    }

    renderCheckboxSquared = field => {
        const { fields = [] } = this.state;
        const { processingFields } = this.props;

        const { observeFields = [], getIsHidden, ...fieldProps }  = field?.props;
        const { name, type, label, className, defaultValue } = field || {};
        const isProcessing = this.props?.isProcessing || processingFields?.includes(name);

        let isHidden = false;

        if (isFunction(getIsHidden)) {
            const observableFields = {};

            observeFields?.forEach(fieldName => {
                observableFields[fieldName] = fields[fieldName];
            });

            isHidden = getIsHidden(observableFields);
        }

        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [type]      : type,
            [className] : className
        });

        return (
            <div key={field.name + field.label} className={fieldWrapperCN}>
                {
                    !isHidden
                        ? (
                            <CheckboxSquared
                                label        = {label}
                                name         = {name}
                                value        = {fields[name] || defaultValue}
                                onChange     = {this.handleChangeField}
                                isProcessing = {!!isProcessing}
                                {...(fieldProps || {})}
                            />
                        )
                        : null
                }
            </div>
        );
    }

    render() {
        const {
            configuration: { fields, title, controls },
            isProcessing, className, commonError, withCommonError,
            classes, t
        } = this.props;

        const isValid = this.checkIsValid();
        const customFormCN = cx(styles.CustomForm, {
            [className] : className
        });

        return (
            <form
                className    = {customFormCN}
                onSubmit     = {this.handleSubmit}
                ref          = {node => this.formRef = node}
                autoComplete = 'off'
            >
                <div className={cx(styles.formFields, { [classes?.form]: classes?.form })}>
                    { title && (
                        <Typography
                            className = {styles.title}
                            variant   = 'headline3'
                            color     = 'primary600'
                        >
                            {title}
                        </Typography>
                    ) }
                    <div className={cx(styles.fieldSet, { [classes?.fieldSet]: classes?.fieldSet })}>
                        { fields?.map(field => this.renderField(field)) }
                    </div>
                </div>
                <FormControls
                    controls         = {controls}
                    className        = {controls?.className}
                    isFormProcessing = {isProcessing}
                    isSubmitDisabled = {!isValid}
                    onSubmit         = {this.handleSubmit}
                    onCancel         = {this.handleCancel}
                    t                = {t}
                />
                { commonError || withCommonError
                    ? <ErrorMessage className = {cx(styles.error, styles.commonError)} error={commonError} />
                    : null
                }
            </form>
        );
    }
}

export default React.memo(CustomForm);

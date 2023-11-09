import React, {
    useEffect,
    useRef,
    useMemo
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';
import { v4 as uuidv4 }   from 'uuid';

import globalEnterHandler from '../../../../utils/eventHandlers/globalEnterHandler';
import { checkIsIOS }     from '../../../../utils/helpers/detect';
import ErrorMessage       from '../../ErrorMessage';
import Input              from './../../Input';
import IconButton         from './../../IconButton';
import CriticalValue      from './../../CriticalValue';
import CircularProgress   from './../../CircularProgress';
import InputNumber        from './../../Input/InputNumber';

import styles             from './Form.less';

const cx = classnames.bind(styles);

const IS_IOS = checkIsIOS();

function Form(props) {  // eslint-disable-line max-lines-per-function
    const {
        onSubmit, isProcessing, isError,
        type, unit,
        onInteract, isRetained, isSettable, // eslint-disable-line no-unused-vars
        classes, errorMessage, inputClasses, isMultiple,
        forwardRef, ...fieldProps
    } = props;
    const submitButtonRef = useRef({});
    const inputRef = useRef({});

    const inputId = useMemo(uuidv4, []);

    useEffect(() => {
        if (!IS_IOS) return;
        const inputElement = document.getElementById(inputId);

        if (!inputElement) return;
        // hack for submit form in ios by done click
        function handleInputChange(e) {
            const value = inputElement?.value;

            handleSubmitForm(e, value);
        }

        inputElement.addEventListener('change', handleInputChange);

        return () => {
            inputElement.removeEventListener('change', handleInputChange);
        };
    }, [ ]);

    useEffect(() => {
        if (isError && !isProcessing) {
            // eslint-disable-next-line babel/no-unused-expressions
            inputRef?.current?.focus();
        }
    }, [ isError, isProcessing ]);

    useEffect(() => {
        if (forwardRef && 'current' in forwardRef) {
            forwardRef.current = inputRef.current;
        }
    }, [ inputRef ]);

    function handleSubmitForm(e, value) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        submitButtonRef?.current?.focus();  // eslint-disable-line babel/no-unused-expressions

        onSubmit(value);
    }

    useEffect(() => {
        function handleEnterPress() {
            // pass
        }

        globalEnterHandler.register(handleEnterPress);

        return () => {
            globalEnterHandler.unregister(handleEnterPress);
        };
    }, [ ]);

    function renderFormControl() {
        switch (type) {
            case 'float':
                return (
                    <InputNumber
                        {...(fieldProps || {})}
                        className      = {cx(styles.inputField, classes.inputField)}
                        classes        = {inputClasses}
                        disabled       = {isProcessing}
                        isInvalid      = {isError}
                        type           = {type}
                        inputId        = {inputId}
                        forwardRef     = {inputRef}
                        floatPrecision = {3}
                        autoFocus
                    />
                );
            case 'integer':
                return (
                    <InputNumber
                        {...(fieldProps || {})}
                        className  = {cx(styles.inputField, classes.inputField)}
                        classes    = {inputClasses}
                        disabled   = {isProcessing}
                        isInvalid  = {isError}
                        type       = {type}
                        inputId    = {inputId}
                        forwardRef = {inputRef}
                        autoFocus
                    />
                );
            default:
                return (
                    <Input
                        {...(fieldProps || {})}
                        className = {cx(styles.inputField, classes.inputField)}
                        classes   = {inputClasses}
                        disabled  = {isProcessing}
                        isInvalid = {isError}
                        inputId   = {inputId}
                        autoFocus
                        ref       = {inputRef}
                        multiline = {isMultiple}
                        rows      = {isMultiple ? 4 : void 0}   // eslint-disable-line no-magic-numbers
                    />
                );
        }
    }

    const formCN = cx(styles.Form, {
        [props?.className] : props?.className,
        processing         : isProcessing,
        withUnit           : unit
    });

    return (
        <form className={formCN} onSubmit={handleSubmitForm} noValidate>
            { renderFormControl() }

            { unit
                ? (
                    <CriticalValue
                        value     = {unit}
                        className = {styles.unitField}
                        maxWidth  = {'60px'}
                    />
                ) : null
            }

            <div className={styles.submitButtonWrapper}>
                <IconButton
                    className          = {cx(styles.submitButton, 'abort-submit', classes.inputBtn)}
                    onClick            = {handleSubmitForm}
                    iconType           = 'check'
                    disabled           = {isProcessing}
                    disableFocusRipple = {isProcessing}
                    forwardRef         = {submitButtonRef}
                />
                <div
                    className = {cx(styles.loaderWrapper, {
                        hidden : !isProcessing
                    })}
                >
                    <CircularProgress
                        color = {'white'}
                        size  = 'S'
                    />
                </div>
            </div>

            { errorMessage
                ? <ErrorMessage
                    className = {styles.errorMsg}
                    error     = {errorMessage}
                />
                : null
            }
        </form>
    );
}

Form.propTypes = {
    onSubmit     : PropTypes.func.isRequired,
    onInteract   : PropTypes.func,
    isError      : PropTypes.bool,
    isProcessing : PropTypes.bool,
    type         : PropTypes.oneOf([ 'float', 'integer', 'string', '' ]),
    unit         : PropTypes.string,
    errorMessage : PropTypes.string,
    isRetained   : PropTypes.bool,
    isSettable   : PropTypes.bool,
    classes      : PropTypes.shape({
        inputField : PropTypes.string,
        inputBtn   : PropTypes.string
    }),
    inputClasses : PropTypes.shape({}),
    isMultiple   : PropTypes.bool,
    forwardRef   : PropTypes.shape({})
};

Form.defaultProps = {
    type         : '',
    isError      : false,
    isProcessing : false,
    unit         : '',
    errorMessage : '',
    onInteract   : void 0,
    isRetained   : false,
    isSettable   : false,
    isMultiple   : false,
    classes      : {},
    inputClasses : {},
    forwardRef   : void 0
};

export default Form;

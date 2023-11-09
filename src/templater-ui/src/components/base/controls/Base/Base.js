/* eslint-disable no-shadow */
import React, {
    useEffect,
    useState,
    useRef
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import globalEnterHandler from '../../../../utils/eventHandlers/globalEnterHandler';
import globalEscHandler   from '../../../../utils/eventHandlers/globalEscHandler';
import CriticalValue      from '../../CriticalValue';
import SvgIcon            from '../../SvgIcon';
import Typography         from '../../Typography';

import Form               from '../Form';

import styles             from './Base.less';

const cx = classnames.bind(styles);
const SKIP_CN = 'skip-control-close';


function BaseControl(props) {   // eslint-disable-line max-lines-per-function
    const {
        onChange, value, name, isSettable,
        isProcessing, maxLength, type,
        onInteract, isInvalid, unit, classes,
        isAutoHideUnit, maxWidths, isRequired,
        withCopyControl, isAutoOpenOnError,
        withEditIcon, forwardRef, isHidden,
        isMultiple, maxValueLines, onChangeEditMode,
        tipMessage, formatter, min, max
    } = props;
    const [ state, setState ] = useState({
        isEditMode : isProcessing,
        localValue : value || '',
        isError    : false
    });
    const { localValue, isEditMode } = state;

    const formRef = useRef({});
    const inputRef = useRef({});
    const timeoutRef = useRef(null);

    const editHandler = isSettable ? activateControl : void 0;

    useEffect(() => {
        if (isInvalid && isAutoOpenOnError) {
            activateControl();
        }
    }, [ isInvalid, isAutoOpenOnError ]);

    useEffect(() => {
        if (onChangeEditMode) onChangeEditMode({ isEditMode: state?.isEditMode });
    }, [ state?.isEditMode ]);

    useEffect(() => {
        if (forwardRef && 'current' in forwardRef) {
            forwardRef.current = {
                setState,
                activateControl,
                deactivateControl,
                closeControl
            };
        }
    }, [ state ]);

    useEffect(() => {
        function handleOutOfFormClick(e) {
            if (!formRef || !formRef?.current?.contains(e.target)) {
                const isSkip = e.target.classList?.contains('skip-control-close');

                if (!isSkip) closeControl();
            }
        }

        function handleEnterClick() {
            const value = localValue || '';

            if (isMultiple && inputRef && 'current' in inputRef) {  // грязный фикс переноса строки для textarea
                const textarea = inputRef?.current?.node?.firstChild;
                const selectionStart = textarea?.selectionStart;

                const nextValue = value;

                setTimeout(() => {  // fix caret position
                    if (!textarea) return;

                    const range = textarea?.createTextRange();

                    range.move('character', selectionStart + 1);
                }, 0);
                setState(prev => ({ ...prev, localValue: nextValue }));
            } else deactivateControl(state?.localValue);
        }

        if (isEditMode) {
            globalEscHandler.register(closeControl);
            globalEnterHandler.register(handleEnterClick);
            document.addEventListener('mousedown', handleOutOfFormClick);
            document.addEventListener('touchstart', handleOutOfFormClick);
        }

        return () => {
            globalEscHandler.unregister(closeControl);
            globalEnterHandler.unregister(handleEnterClick);
            document.removeEventListener('mousedown', handleOutOfFormClick);
            document.removeEventListener('touchstart', handleOutOfFormClick);

            clearTimeout(timeoutRef.current);
        };
    }, [
        isMultiple, isProcessing, isEditMode, state?.localValue, formRef,
        timeoutRef, inputRef
    ]);

    useEffect(() => {
        if (isEditMode) {   // scroll textarea to the end and set end caret position
            const textarea = inputRef?.current?.node?.firstChild;
            const scrollHeight = textarea.scrollHeight;

            setTimeout(() => {  // set caret position to the end
                if (textarea) {
                    textarea.selectionStart = localValue?.length;
                    textarea.selectionEnd = localValue?.length;
                    textarea.scrollTop = scrollHeight;
                }
            }, 0);
        }
    }, [ isEditMode ]);

    function handleFormSubmit(value) {
        if (isProcessing) return;

        deactivateControl(value);
    }

    function getMultipleToRender() {
        const text = state?.localValue;
        const breakLinesAmount = (text || '')?.split('')?.filter(s => s === '\n')?.length;
        const maxBreakLines = maxValueLines || 4;   // eslint-disable-line  no-magic-numbers

        let description = text;

        if (breakLinesAmount > maxBreakLines) {
            let counter = 0;

            text.replace(/\n/g, (match, offset) => {
                if (counter === maxBreakLines) description = text?.slice(0, offset);

                counter += 1;
            });
        }

        const maxContentLength = maxBreakLines * 50;   // eslint-disable-line  no-magic-numbers

        return description?.length > maxContentLength
            ? `${description?.trim()?.slice(0, maxContentLength)}...`
            : description?.trim();
    }

    function renderMultipleValue() {
        return (
            <div className={cx(styles.multipleValue, classes.multipleValue)} onClick={editHandler}>
                <Typography
                    variant   = 'body2'
                    className = {styles.content}
                    color     = 'greyDark'
                >
                    { getMultipleToRender(state?.localValue) }
                    <div className={styles.editIcon}>
                        <SvgIcon
                            type  = 'edit'
                            color = 'greyDark'
                        />
                    </div>
                </Typography>
            </div>
        );
    }

    function handleInputChange({ value }) { // eslint-disable-line no-shadow
        if (isProcessing || (maxLength && maxLength < value.length)) return;

        setState({
            isEditMode,
            localValue : formatter ? formatter(value) : value,
            isError    : false
        });

        if (isInvalid && onInteract) onInteract(name);
    }

    function activateControl() {
        if (!isSettable || state?.isEditMode) return;

        if (onInteract && !isAutoOpenOnError) onInteract(name);

        setState({
            isEditMode : true,
            localValue : value !== '—' ? value : '',
            isError    : isAutoOpenOnError && isInvalid
        });
    }

    function getProcessValue(value) {
        return max ? value?.slice(0, max) : value;
    }

    async function deactivateControl(value) {
        if (!isSettable) return;
        if (onInteract) onInteract(name);

        const valueToSet = value === '' ? value : value  || localValue;

        if (isRequired || min) {
            const isValid = min
                ? min <= valueToSet?.trim()?.length
                : !!valueToSet?.trim()?.length;

            if (!isValid) return setState(prev => ({ ...prev, isError: true }));
        }

        onChange({
            value     : getProcessValue(valueToSet),
            name,
            onSuccess : () => closeControl(),
            onError   : () => setState(prev => ({ ...prev, isError: true }))
        });
    }

    function closeControl(valueToSet) {
        if (isProcessing) return;
        if (onInteract) onInteract(name);
        const CLOSE_DELAY = 100;

        if (onChangeEditMode) onChangeEditMode({ isEditMode: false });

        timeoutRef.current = setTimeout(() => {
            setState({
                isEditMode : false,
                localValue : typeof valueToSet === 'string' ? valueToSet || value : value,
                isError    : false
            });
        }, CLOSE_DELAY);
    }

    const baseControlCN = cx(styles.BaseControl, {
        [props?.className] : props?.className,
        withCopyControl
    });

    if (isHidden) return null;

    return (
        <div className={baseControlCN}>
            { isEditMode
                ? (
                    <div className={styles.controlWrapper}>
                        { tipMessage
                            ? (
                                <div className={cx(styles.tipMessage, SKIP_CN)}>
                                    {tipMessage}
                                </div>
                            ) : null
                        }
                        <div>
                            <div
                                className = {cx(styles.formWrapper, classes.formWrapper)}
                                ref       = {node => formRef.current = node}
                            >
                                <Form
                                    {...props}
                                    type     = {type}
                                    name     = {name}
                                    value    = {max ? localValue?.slice(0, max) || '' : localValue}
                                    isError  = {state?.isError}
                                    onChange = {handleInputChange}
                                    onSubmit = {handleFormSubmit}
                                    unit     = {isAutoHideUnit ? undefined : unit}
                                    isMultiple = {isMultiple}
                                    forwardRef = {inputRef}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={cx(styles.value, classes.value, { withUnit: unit })}>
                        { !isMultiple
                            ? (
                                <CriticalValue
                                    value       = {value}
                                    className   = {cx(styles.valueField, classes.valueField)}
                                    maxWidth    = {maxWidths.value}
                                    onClick     = {editHandler}
                                    isUnderline = {isSettable}
                                />
                            ) : renderMultipleValue()
                        }

                        { unit
                            ? (
                                <CriticalValue
                                    value     = {unit}
                                    className = {cx(styles.unitField, classes.unit)}
                                    maxWidth  = {maxWidths?.unit}
                                    onClick   = {editHandler}
                                />
                            ) : null
                        }
                        { withEditIcon && !isMultiple
                            ? (
                                <div
                                    className = {styles.editIcon}
                                    onClick   = {editHandler}
                                >
                                    <SvgIcon
                                        type  = 'edit'
                                        color = 'greyDark'
                                    />
                                </div>
                            ) : null
                        }
                    </div>
                )
            }
        </div>
    );
}

BaseControl.propTypes = {
    name              : PropTypes.string,
    type              : PropTypes.string,
    unit              : PropTypes.string,
    value             : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange          : PropTypes.func,
    maxLength         : PropTypes.number,
    isSettable        : PropTypes.bool,
    isInvalid         : PropTypes.bool,
    isProcessing      : PropTypes.bool,
    isAutoHideUnit    : PropTypes.bool,
    isRequired        : PropTypes.bool,
    isAutoOpenOnError : PropTypes.bool,
    withCopyControl   : PropTypes.bool,
    onInteract        : PropTypes.func,
    classes           : PropTypes.shape({
        formWrapper : PropTypes.string,
        valueField  : PropTypes.string,
        value       : PropTypes.string,
        inputField  : PropTypes.string,
        inputBtn    : PropTypes.string,
        unit        : PropTypes.string
    }),
    maxWidths : PropTypes.shape({
        value : PropTypes.string,
        unit  : PropTypes.string
    }),
    isMultiple       : PropTypes.bool,
    withEditIcon     : PropTypes.bool,
    forwardRef       : PropTypes.shape({}),
    isHidden         : PropTypes.bool,
    maxValueLines    : PropTypes.number,
    onChangeEditMode : PropTypes.func,
    tipMessage       : PropTypes.any,
    formatter        : PropTypes.func,
    min              : PropTypes.number,
    max              : PropTypes.number
};

BaseControl.defaultProps = {
    name              : void 0,
    value             : void 0,
    onChange          : void 0,
    maxLength         : void 0,
    unit              : void 0,
    type              : void 0,
    isSettable        : false,
    isInvalid         : false,
    isProcessing      : false,
    isAutoHideUnit    : false,
    isRequired        : false,
    isAutoOpenOnError : false,
    withCopyControl   : false,
    onInteract        : void 0,
    classes           : {},
    maxWidths         : {
        value : 'calc(100% - 70px)',
        unit  : '60px'
    },
    isMultiple       : false,
    withEditIcon     : false,
    forwardRef       : void 0,
    isHidden         : false,
    maxValueLines    : void 0,
    onChangeEditMode : void 0,
    tipMessage       : void 0,
    formatter        : void 0,
    min              : void 0,
    max              : void 0
};

export default BaseControl;

/* eslint-disable no-magic-numbers, no-shadow */

import React, {
    useCallback,
    useState,
    useEffect,
    useRef
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import globalEnterHandler from './../../../../utils/eventHandlers/globalEnterHandler';
import {
    getFullDate,
    getValidDate
}                         from './../../../../utils/date';
import Input              from './../Input';
import IconButton         from './../../IconButton';

import styles           from './InputDate.less';

const cx = classnames.bind(styles);

function InputDate(props) {   /* eslint-disable-line max-lines-per-function */
    const {
        value,
        withError,
        errorMessage,
        label,
        name,
        onChange,
        isProcessing,
        defaultTime,
        ...rest
    } = props;
    const componentRef = useRef({});
    const inputRef     = useRef({});

    const [ isInputEdit, setIsInputEdit ] = useState(false);

    const [ localValue, setLocalValue ] = useState(() => {
        if (!value) return '';
        const isValid = Number.isInteger(+value);

        if (!isValid)  return '';

        const date = new Date(value);
        const formatted = getFullDate(date);

        componentRef.current.prevValue = formatted;

        return formatted;
    });

    useEffect(() => {
        if (!value && !localValue) return;

        syncLocalValue(value);
    }, [ value ]);

    useEffect(() => {
        function submitOnEnter(e) {
            // prevent modal submit if input focused
            e.preventDefault();
            e.stopPropagation();

            const validDate = getValueToSubmit(localValue);

            if (validDate) {
                onChange({
                    name,
                    value : validDate
                });
            }
            document.activeElement.blur();
        }

        if (isInputEdit) globalEnterHandler.register(submitOnEnter);
        else globalEnterHandler.unregister(submitOnEnter);

        return () => {
            globalEnterHandler.unregister(submitOnEnter);
        };
    }, [ isInputEdit, localValue, onChange, name ]);

    function syncLocalValue(value) {
        const isValid = Number.isInteger(+value);

        if (isValid) {
            const date = new Date(+value);

            const formatted = getFullDate(date);

            setLocalValue(formatted);
            componentRef.current.prevValue = formatted;
        }
    }

    function handleChangeInput({ value }, e) {
        const digitsValue = value.replace(/\D/g, '');
        const isOverflow    = `${digitsValue}`.length > MAX_LENGTH;

        const MAX_LENGTH = 12;

        const valueWithoutOverflow = isOverflow
            ? digitsValue
            : `${digitsValue}`.slice(0, MAX_LENGTH);

        componentRef.current.prevValue = localValue;

        const maskedValue = getMaskedValue(valueWithoutOverflow);

        setLocalValue(valueWithoutOverflow);

        fixCaretPosition({ target: e?.target, value: maskedValue });
    }

    function getValueToSubmit(localValue) {
        const digitsValue = localValue ? localValue.replace(/\D/g, '') : '';

        const day     = digitsValue.slice(0, 2);
        const month   = digitsValue.slice(2, 4);
        const year    = digitsValue.slice(4, 8);
        const hours   = digitsValue.slice(8, 10)  || void 0;
        const minutes = digitsValue.slice(10, 12) || void 0;

        const isDayValid   = day.length   === 2;
        const isMonthValid = month.length === 2;
        const isYearValid  = year.length  === 4;

        function resetFieldValue() {
            const date = new Date(+value);
            const formatted = getFullDate(date);

            const valueToSet = value ? formatted.replace(/\D/g, '') : '';

            setLocalValue(valueToSet);
        }

        if (!isDayValid || !isMonthValid || !isYearValid) {
            resetFieldValue();

            return;
        }

        let [ processHours, processMinutes ] = [ hours, minutes ];

        if (!hours) {
            if (defaultTime === 'dayStart')    processHours = 0;
            else if (defaultTime === 'dayEnd') processHours = 23;
        }

        if (!minutes) {
            if (defaultTime === 'dayStart')    processMinutes = 0;
            else if (defaultTime === 'dayEnd') processMinutes = 59;
        }

        const validDate = getValidDate({
            day,
            month,
            year,
            hours   : processHours,
            minutes : processMinutes
        });

        if (!validDate) {
            resetFieldValue();

            return;
        }

        return validDate;
    }

    function handleBlurInput() {
        const validDate = getValueToSubmit(localValue);

        if (!validDate) return;

        onChange({
            name,
            value : validDate
        });

        setIsInputEdit(() => false);
    }

    function changeInputValue(valueToSet) {
        componentRef.current.prevValue = localValue;

        setLocalValue(valueToSet);
    }

    function fixCaretPosition({ target, value, isStartEdit = false }) {    // eslint-disable-line
        if (!target) return;

        const thisRef            = componentRef.current;
        const { prevValue = '' } = thisRef;
        const caretPosition      = target.selectionStart;
        const maskedValue        = getMaskedValue(value || '');
        const maskedPrevValue    = getMaskedValue(prevValue || '');

        const isChanged = maskedValue.replace(/\D/g, '') !== maskedPrevValue.replace(/\D/g, '');

        if (!isChanged) {
            const nextCaretPosition = caretPosition - 1;

            thisRef.updateCaretTimeout = setTimeout(() => {
                target.selectionStart = nextCaretPosition;
                target.selectionEnd   = nextCaretPosition;
            }, 0);

            return;
        }

        const isMoveForward       = maskedPrevValue.length < maskedValue.length;
        const isStayAtThePotision = maskedPrevValue.length === maskedValue.length;

        const symbolsAfterCaret        = maskedValue.slice(caretPosition);
        const symbolsBeforeCaret       = maskedValue.slice(0, caretPosition).split('').reverse().join('');
        const forwardDigitSymbolIndex  = symbolsAfterCaret.split('').findIndex(symbol => /\d/.test(symbol));
        const backwardDigitSymbolIndex = symbolsBeforeCaret.split('').findIndex(symbol => /\d/.test(symbol));

        if (isStayAtThePotision || isMoveForward) {
            const isCaretAtTheEnd = maskedPrevValue.length < caretPosition;

            if (isCaretAtTheEnd) return;

            const nextCaretPosition = forwardDigitSymbolIndex > 0
                ? caretPosition + forwardDigitSymbolIndex
                : caretPosition;

            thisRef.updateCaretTimeout = setTimeout(() => {
                target.selectionStart = nextCaretPosition;
                target.selectionEnd   = nextCaretPosition;
            }, 0);
        } else {    // move back
            const isCaretAtTheEnd = caretPosition === maskedPrevValue.length - 1;

            if (isCaretAtTheEnd) return;

            const nextCaretPosition = forwardDigitSymbolIndex > 0
                ? caretPosition - backwardDigitSymbolIndex
                : caretPosition;

            thisRef.updateCaretTimeout = setTimeout(() => {
                target.selectionStart = nextCaretPosition;
                target.selectionEnd   = nextCaretPosition;
            }, 0);
        }
    }

    function handleStartEdit() {
        setIsInputEdit(true);
    }

    function getMaskedValue(rawValue) {
        const format = '../../.... ..:..';

        const value = rawValue ? rawValue.replace(/\D/g, '') : '';

        if (componentRef.current.prevMaskedValue === value) {
            return componentRef.current.prevMaskedResult;
        }

        const formattedArray = [];
        let valueStringIndex = 0;
        const valueLength = value.length;
        const formatArray = format.split('');

        formatArray.forEach((symbol /* , symbolIndex */) => {
            if (valueStringIndex > valueLength - 1 /*  && formatArray[symbolIndex + 1] === '.' */) return;

            if (symbol === '.') {
                formattedArray.push(value[valueStringIndex]);

                valueStringIndex += 1;
            } else {
                formattedArray.push(symbol);
            }
        });
        const result = formattedArray.join('');

        componentRef.current.prevMaskedValue  = value;  // eslint-disable-line more/no-duplicated-chains
        componentRef.current.prevMaskedResult = result;  // eslint-disable-line more/no-duplicated-chains

        return result;
    }

    function handleClearField() {
        changeInputValue('');
        onChange({ name, value: '' });
        inputRef.current.focus();
    }

    function renderClearButton() {
        if (!value) return;

        return (
            <IconButton
                key        = 'clearButton'
                className  = {styles.clearIconButton}
                onClick    = {handleClearField}
                iconType   = 'cross'
            />
        );
    }

    const inputDateCN = cx(styles.InputDate, {
        // withValue : isValueExist,
    });

    return (
        <div className={inputDateCN}>
            <Input
                {...rest}
                value                = {getMaskedValue(localValue)}
                ref                  = {inputRef}
                label                = {label}
                onEditStart          = {handleStartEdit}
                onChange             = {useCallback(handleChangeInput, [ localValue ])}
                onBlur               = {useCallback(handleBlurInput, [ localValue ])}
                renderEndAdornment   = {renderClearButton}
                errorMessage         = {errorMessage}
                fixSelectionStart    = {false}
                withError            = {withError}
                isProcessing         = {isProcessing}
                disabled             = {isProcessing}
                withValue            = {!!rest.value || rest.value === 0}
            />
        </div>
    );
}

InputDate.propTypes = {
    value        : PropTypes.any,
    // value : PropTypes.oneOfType([
    //     PropTypes.number,
    //     PropTypes.string
    // ]),
    name         : PropTypes.string,
    label        : PropTypes.string,
    onChange     : PropTypes.func.isRequired,
    withError    : PropTypes.bool,
    isProcessing : PropTypes.bool,
    errorMessage : PropTypes.string,
    defaultTime  : PropTypes.oneOf([ 'dayStart', 'dayEnd' ])
};

InputDate.defaultProps = {
    value        : '',
    name         : '',
    label        : '',
    withError    : true,
    isProcessing : false,
    errorMessage : '',
    defaultTime  : 'dayStart'
};

export default React.memo(InputDate);

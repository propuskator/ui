import React, { useMemo } from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';
import InputAdornment     from '@material-ui/core/InputAdornment';

import { checkIsIOS }     from '../../../../utils/helpers/detect';

import IconButton         from './../../IconButton';
import Input              from './../Input';

import useLongPress       from './useLongPress';
import styles             from './InputNumber.less';

const cx = classnames.bind(styles);

const INPUT_PROPS = {
    pattern     : '[0-9.-]*',
    placeholder : '00'
};

function InputNumber(props) {   // eslint-disable-line  max-lines-per-function
    const {
        onChange, fillWithZero, isPositive,
        maxLength, type, inputProps, name, value,
        label, forwardRef, floatPrecision, ...fieldProps
    } = props;

    const isIOSFallback = useMemo(checkIsIOS, []);

    function handleChange({ name, value }, e) {    // eslint-disable-line no-shadow
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        if (maxLength && value?.length > maxLength) return;
        if (value === '') return onChange({ name, value: '' });

        let valueToSet = '';

        if (type === 'integer') {
            const regexp = isPositive ? /\D/g : /([^-\d]|(?!^)-$)/g;
            const validInput = `${value}`.replace(regexp, '');

            if (validInput.match(/^-?0\d+$/)) return;

            const intNumber = parseInt(validInput === '-' ? '-0' : validInput, 10);

            valueToSet = isNaN(intNumber) ? '' : validInput;
        } else if (type === 'float') {
            const regexp = isPositive ? /[^\d.]/g : /[^-\d.]/g;
            let validInput = `${value}`.replace(regexp, '');

            if (validInput.match(/^-?0\d+$/g) || validInput.match(/(\.\d*\.|(?!^)-$)/g)) return;

            // Проверка на превышение допустимого количества символов после точки
            if (floatPrecision) {
                /* eslint-disable-next-line security/detect-non-literal-regexp */
                const precisionRegexp = new RegExp(`-?\\d+\\.\\d{${floatPrecision + 1},}`);

                if (validInput.match(precisionRegexp)) {
                    const fractionalPart = validInput.match(/.\d+$/)[0];
                    const integralPart = validInput.match(/^-?\d+/)[0];

                    validInput = integralPart + fractionalPart.slice(0, floatPrecision + 1);
                }
            }

            const floatNumber = parseFloat(validInput === '-' ? '-0' : validInput);

            valueToSet = isNaN(floatNumber) ? '' : `${validInput}`;
        }

        if (onChange) onChange({ name, value: valueToSet });
    }

    function handleIncrease() {
        const number   = parseFloat(value);
        const isNumber = !isNaN(number);
        let valueToSet = isNumber ? number : 1;

        if (type === 'float') {
            /* eslint-disable-next-line no-magic-numbers */
            valueToSet = (valueToSet + 10 ** (-1 * floatPrecision)).toFixed(floatPrecision);
        }
        if (isPositive && valueToSet < 0) valueToSet = 0;

        if (type === 'integer') valueToSet = parseInt(valueToSet + 1, 10);

        if (fillWithZero) {
            const startWithZero = /^0./.test(value) || value === '';

            if (startWithZero && valueToSet < 10) valueToSet = `0${valueToSet}`;  // eslint-disable-line no-magic-numbers
        }

        handleChange({ name, value: valueToSet });
    }

    function handleDecrease() {
        const number   = parseFloat(value);
        const isNumber = !isNaN(number);
        let valueToSet = isNumber ? number : 1;

        if (type === 'float') {
            /* eslint-disable-next-line no-magic-numbers */
            valueToSet = (valueToSet - 10 ** (-1 * floatPrecision)).toFixed(floatPrecision);
        }

        if (isPositive && valueToSet < 0) valueToSet = 0;

        if (type === 'integer') valueToSet = parseInt(valueToSet - 1, 10);

        if (fillWithZero) {
            const startWithZero = /^0./.test(value) || value === '';

            if (startWithZero && valueToSet < 10) valueToSet = `0${valueToSet}`;  // eslint-disable-line no-magic-numbers
        }

        handleChange({ name, value: valueToSet });
    }

    const increaseProps = useLongPress(handleIncrease);
    const decreaseProps = useLongPress(handleDecrease);

    function renderEndAdornment() {
        return (
            <InputAdornment
                position  = 'start'
                className = {styles.inputAdornment}
            >
                <IconButton
                    className       = {cx(styles.arrowButton, 'abort-submit')}
                    iconType        = 'arrowDown'
                    onClick         = {handleIncrease}
                    iconButtonProps = {increaseProps}
                    disableFocusRipple
                />
                <IconButton
                    className       = {cx(styles.arrowButton, 'abort-submit')}
                    iconType        = 'arrowDown'
                    onClick         = {handleDecrease}
                    iconButtonProps = {decreaseProps}
                    disableFocusRipple
                />
            </InputAdornment>
        );
    }

    const { themeMode } = fieldProps;

    const inputNumberCN = cx(styles.InputNumber, {
        [props?.className]    : props?.className,
        [`${themeMode}Theme`] : themeMode
    });

    return (
        <Input
            {...(fieldProps || {})}
            name               = {name}
            value              = {value}
            label              = {label}
            className          = {inputNumberCN}
            renderEndAdornment = {renderEndAdornment}
            onChange           = {handleChange}
            fixSelectionStart  = {false}
            inputProps         = {{
                ...INPUT_PROPS,
                ...(inputProps || {}),
                inputMode : isIOSFallback ? 'text' : 'decimal'
            }}
            type               = {isIOSFallback ? 'text' : 'number'}
            ref                = {forwardRef}
        />
    );
}

InputNumber.propTypes = {
    name           : PropTypes.string,
    value          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isPositive     : PropTypes.bool,
    onChange       : PropTypes.func,
    maxLength      : PropTypes.number,
    type           : PropTypes.oneOf([ 'integer', 'float' ]),
    fillWithZero   : PropTypes.bool,
    inputProps     : PropTypes.shape({}),
    forwardRef     : PropTypes.shape({}),
    label          : PropTypes.string,
    themeMode      : PropTypes.string,
    floatPrecision : PropTypes.number
};

InputNumber.defaultProps = {
    name           : void 0,
    value          : void 0,
    onChange       : void 0,
    maxLength      : void 0,
    isPositive     : false,
    type           : 'integer',
    fillWithZero   : false,
    inputProps     : {},
    forwardRef     : {},
    label          : '',
    themeMode      : '',
    floatPrecision : void 0
};

export default InputNumber;

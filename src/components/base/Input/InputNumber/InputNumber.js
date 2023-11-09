import React          from 'react';
import PropTypes      from 'prop-types';
import classnames     from 'classnames/bind';
import InputAdornment from '@material-ui/core/InputAdornment';

import IconButton     from 'templater-ui/src/components/base/IconButton';
import Input          from 'templater-ui/src/components/base/Input';

import useLongPress   from './useLongPress';
import styles         from './InputNumber.less';

const cx = classnames.bind(styles);

const INPUT_PROPS = {
    inputMode   : 'numeric',
    pattern     : '[0-9]*',
    placeholder : '00'
};

function InputNumber(props) {   // eslint-disable-line  max-lines-per-function
    const {
        onChange, fillWithZero, isPositive,
        maxLength, type, inputProps, name, value,
        ...fieldProps
    } = props;

    function handleChange({ name, value }, e) {    // eslint-disable-line no-shadow
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        if (maxLength && value?.length > maxLength) return;

        if (value === '') return onChange({ name, value: '' });
        let valueToSet = '';

        if (type === 'integer') {
            const regexp = isPositive ? /[^\d]/g : /[^\d]/g;
            const onlyDigits = value ? `${value}`.replace(regexp, '') : '0';
            const intNumber = parseFloat(onlyDigits);

            if (isNaN(intNumber)) return;
            valueToSet = onlyDigits;
        } else if (type === 'float') {
            const regexp = isPositive ? /[^\d.]/g : /[^\d-.]/g;
            const onlyDigits = value ? `${value}`.replace(regexp, '') : '0';
            const floatNumber = parseFloat(onlyDigits);
            const isPointAtTheEnd = value?.length > 1
                && value[value?.length - 1] === '.'
                && !value?.slice(0, -1).includes('.');  // eslint-disable-line no-magic-numbers

            if (isNaN(floatNumber)) return;
            valueToSet = !isPointAtTheEnd ? floatNumber : `${floatNumber}.`;
        }

        if (onChange) onChange({ name, value: valueToSet });
    }

    function handleIncrease() {
        const number   = parseFloat(value);
        const isNumber = !isNaN(number);
        let valueToSet = isNumber ? number + 1 : 1;

        if (isPositive && valueToSet < 0) valueToSet = 0;

        if (type === 'integer') valueToSet = parseInt(valueToSet, 10);

        if (fillWithZero) {
            const startWithZero = /^0./.test(value) || value === '';

            if (startWithZero && valueToSet < 10) valueToSet = `0${valueToSet}`;  // eslint-disable-line no-magic-numbers
        }

        handleChange({ name, value: valueToSet });
    }

    function handleDecrease() {
        const number   = parseFloat(value);
        const isNumber = !isNaN(number);
        let valueToSet = isNumber ? number - 1 : 0;

        if (isPositive && valueToSet < 0) valueToSet = 0;

        if (type === 'integer') valueToSet = parseInt(valueToSet, 10);

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

    const inputNumberCN = cx(styles.InputNumber, {
        [props?.className] : props?.className
    });

    return (
        <Input
            {...(fieldProps || {})}
            name               = {name}
            value              = {value}
            label              = ''
            className          = {inputNumberCN}
            renderEndAdornment = {renderEndAdornment}
            onChange           = {handleChange}
            fixSelectionStart  = {false}
            inputProps         = {{
                ...INPUT_PROPS,
                ...(inputProps || {})
            }}
            type               = 'number'
        />
    );
}

InputNumber.propTypes = {
    name         : PropTypes.string,
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isPositive   : PropTypes.bool,
    onChange     : PropTypes.func,
    maxLength    : PropTypes.number,
    type         : PropTypes.oneOf([ 'integer', 'float' ]),
    fillWithZero : PropTypes.bool,
    inputProps   : PropTypes.shape({})
};

InputNumber.defaultProps = {
    name         : void 0,
    value        : void 0,
    onChange     : void 0,
    maxLength    : void 0,
    isPositive   : false,
    type         : 'integer',
    fillWithZero : false,
    inputProps   : {}
};

export default InputNumber;

/* eslint-disable no-magic-numbers, no-shadow */
import React, {
    useEffect,
    useState
}                       from 'react';
import PropTypes        from 'prop-types';
import LIVR             from 'livr';
import classnames       from 'classnames/bind';

import { EMPTY_TEXT }   from '../../../../constants/index.js';
import IconButton       from '../../IconButton';
import CriticalValue    from '../../CriticalValue';
import CircularProgress from '../../CircularProgress';

import {
    getDecimalPartLength,
    gracefulDecrement,
    gracefulIncrement,
    isNumeric
}                       from '../../../../utils/numbers';

import styles           from './Thermostat.less';

const slowUpdate   = 350;
const mediumUpdate = 200;
const fastUpdate   = 130;

const validator = new LIVR.Validator({
    value : [ 'decimal', 'required' ]
});

const cx = classnames.bind(styles);

function Thermostat(props) {    // eslint-disable-line max-lines-per-function
    const { value, advanced, name, onChange, isDisabled, isProcessing } = props;
    const { max, min, unit } = advanced;

    const [ _value, _setValue ] = useState(value);
    const [ _interval, _setInterval ] = useState();
    const [ updateCount, setUpdateCount ] = useState(0);

    const isControlDisabled = isProcessing || isDisabled;

    useEffect(() => {
        if (`${value}` !== `${_value}`) {
            _setValue(value);
        }
    }, [ value ]);

    function handleChange() {
        if (isProcessing || isDisabled) return;
        if (onChange) {
            onChange({
                name,
                value   : _value,
                onError : ({ prevValue } = {}) =>  {
                    _setValue(prevValue);
                }
            });
        }
        setUpdateCount(0);
    }

    function handleMouseDown(direction) {
        if (!isControlDisabled) {
            updateWithInterval(direction);
        }
    }

    function handleMouseUp() {
        clearInterval(_interval);
        handleChange();
    }

    function handleMouseLeave() {
        clearInterval(_interval);

        if (`${value}` !== `${_value}`) {
            handleChange();
        }
    }

    function validateValue(value) {
        return validator.validate({ value });
    }

    function getSafeValue(val) {
        return validateValue(val) ? val : 0;
    }

    function validateRange(next) {
        if (next >= min && next <= max) {
            return next;
        } else if (next > max) {
            return max;
        }

        return min;
    }

    function increaseDecreaseValue(value, direction) {
        const { advanced: { step }, dataType = 'integer' } = props;
        const safeValue = getSafeValue(value);
        let stepFactor = 1;

        if (updateCount > 25) stepFactor = 2;
        if (updateCount > 40) stepFactor = 3;

        const stepToUpdate = Math.round(step * stepFactor * 100) / 100;

        if (dataType === 'integer') {
            return direction === 'increase' ? +safeValue + stepToUpdate : safeValue - stepToUpdate;
        }

        if (dataType === 'float') {
            return direction === 'increase'
                ? gracefulIncrement(safeValue, stepToUpdate)
                : gracefulDecrement(safeValue, stepToUpdate);
        }
    }

    function updateValue(direction) {
        setUpdateCount(updateCount + 1);

        _setValue(prev => {
            const nextValue = increaseDecreaseValue(prev, direction);

            return isNumeric(min) && isNumeric(max) ? validateRange(nextValue) : nextValue;
        });
    }

    function updateWithInterval(direction, prevInterval, intervalSpeed = slowUpdate) {
        clearInterval(prevInterval);

        updateValue(direction);

        const interval = setInterval(() => {
            if (updateCount === 4) return updateWithInterval(direction, interval, mediumUpdate,);
            else if (updateCount === 15) return updateWithInterval(direction, interval, fastUpdate);

            updateValue(direction);
        }, intervalSpeed);

        _setInterval(interval);
    }

    function roundValue() {
        const { advanced: { step }, value: initialValue } = props;

        const decimalPartLengthValue = getDecimalPartLength(initialValue);
        const decimalPartLengthStep = getDecimalPartLength(step);
        const decimalQuantity = decimalPartLengthStep > decimalPartLengthValue ?
            decimalPartLengthStep :
            decimalPartLengthValue;
        const safeDecimalQuantity = Math.min(decimalQuantity, 20);

        return parseFloat(_value, 10).toFixed(safeDecimalQuantity);
    }

    function handleDecreaseValue() {
        handleMouseDown('decrease');
    }

    function handleIncreaseValue() {
        handleMouseDown('increase');
    }

    const isValueValid = validateValue(_value);
    const criticalValue = isValueValid ? roundValue() : EMPTY_TEXT;

    return (
        <div className={styles.Thermostat}>
            <div
                className    = {isControlDisabled ? styles.disabledControl : void 0}
                onTouchStart = {handleDecreaseValue}
                onMouseDown  = {handleDecreaseValue}
                onTouchEnd   = {handleMouseUp}
                onMouseUp    = {handleMouseUp}
                onMouseLeave = {handleMouseLeave}
            >
                <IconButton
                    className  = {styles.control}
                    iconType   = 'minusButton'
                    color      = 'primaryGreen'
                    size       = 'S'
                    isDisabled = {isControlDisabled}
                />
            </div>
            <div className={cx(styles.valueWrapper, { processing: isProcessing, withUnit: unit })}>
                { isProcessing
                    ? (
                        <div className={styles.processingIndicator}>
                            <CircularProgress
                                color={'greyDark'}
                            />
                        </div>
                    ) : null
                }
                <>
                    <CriticalValue
                        className = {styles.value}
                        value     = {criticalValue}
                        maxWidth  = {unit ? '29px' : '40px'}
                    />
                    { unit
                        ? (
                            <CriticalValue
                                className = {styles.unit}
                                value     = {unit}
                                maxWidth  = {'20px'}
                            />
                        )
                        : null
                    }
                </>
            </div>
            <div
                className    = {isControlDisabled ? styles.disabledControl : void 0}
                onTouchStart = {handleIncreaseValue}
                onMouseDown  = {handleIncreaseValue}
                onTouchEnd   = {handleMouseUp}
                onMouseUp    = {handleMouseUp}
                onMouseLeave = {handleMouseLeave}
            >
                <IconButton
                    className  = {styles.control}
                    iconType   = 'plusButton'
                    color      = 'primaryGreen'
                    size       = 'S'
                    isDisabled = {isControlDisabled}
                />
            </div>
        </div>
    );
}

Thermostat.propTypes = {
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    name         : PropTypes.string,
    onChange     : PropTypes.func,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    advanced     : PropTypes.shape({
        step : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        min  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        max  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        unit : PropTypes.oneOfType([ PropTypes.string ])
    }).isRequired,
    dataType : PropTypes.string
};

Thermostat.defaultProps = {
    value        : EMPTY_TEXT,
    name         : '',
    onChange     : void 0,
    isDisabled   : false,
    isProcessing : false,
    dataType     : 'integer'
};


export default React.memo(Thermostat);

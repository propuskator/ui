import React         from 'react';
import PropTypes     from 'prop-types';
import classnames    from 'classnames/bind';

import InputPassword from '../../Input/InputPassword';

import StrengthBar   from './StrengthBar';
import styles        from './InputPasswordStrength.less';

const cx = classnames.bind(styles);

function InputPasswordStrength(props) {
    const { className, userInputs, strengthLevels, value, customInput : CustomInput, t, ...rest } = props;

    function renderStrengthBar() {
        return (
            <StrengthBar
                className      = {styles.strengthBar}
                value          = {value}
                strengthLevels = {strengthLevels}
                userInputs     = {userInputs}
                t              = {t}
            />
        );
    }

    const inputPasswordStrengthCN = cx(styles.InputPasswordStrength, {
        [className] : className
    });

    const InputComponent = CustomInput ? CustomInput : InputPassword;

    return (
        <div className={inputPasswordStrengthCN}>
            <InputComponent
                {...rest}
                value                = {value}
                renderExtraAdornment = {renderStrengthBar}
            />
        </div>
    );
}


InputPasswordStrength.propTypes = {
    className      : PropTypes.string,
    userInputs     : PropTypes.array,
    value          : PropTypes.string,
    customInput    : PropTypes.node,
    strengthLevels : PropTypes.arrayOf(PropTypes.shape({
        label : PropTypes.string,
        color : PropTypes.string,
        width : PropTypes.string
    })),
    t : PropTypes.func
};

InputPasswordStrength.defaultProps = {
    className      : '',
    userInputs     : [],
    value          : '',
    customInput    : void 0,
    t              : (text) => text,
    strengthLevels : [
        { label: 'Weak', color: '#F15045', width: '15%' },
        { label: 'Weak', color: '#F15045', width: '35%' },
        { label: 'Fair', color: '#F1AC45', width: '55%' },
        { label: 'Fair', color: '#F1AC45', width: '75%' },
        { label: 'Strong', color: '#5CCD75', width: '100%' }
    ]
};

export default InputPasswordStrength;

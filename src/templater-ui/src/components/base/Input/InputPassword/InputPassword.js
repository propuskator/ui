import React, {
    useState,
    useEffect
}                     from 'react';
import classnames     from 'classnames/bind';
import PropTypes     from 'prop-types';

import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility     from '@material-ui/icons/Visibility';
import VisibilityOff  from '@material-ui/icons/VisibilityOff';

import Input          from './../Input';

import styles         from './InputPassword.less';

const cx = classnames.bind(styles);


function InputPassword(props) {
    const { value } = props;
    const isValueExist = !!value?.length;
    const [ showPassword, changeShowPassword ] = useState(true);

    useEffect(() => {
        if (!isValueExist) changeShowPassword(true);
    }, [ isValueExist ]);

    function handleTogglePasswordView() {
        changeShowPassword((value) => !value);  // eslint-disable-line  no-shadow
    }

    function renderEndAdornment() {
        const { renderExtraAdornment } = props;

        return (
            <>
                { renderExtraAdornment
                    ? (
                        <InputAdornment
                            position  = 'end'
                            className = {styles.inputAdornment}
                        >
                            {renderExtraAdornment()}
                        </InputAdornment>
                    ) : null
                }
                <InputAdornment
                    position  = 'end'
                    className = {cx(styles.inputAdornment, { withExtra: !!renderExtraAdornment })}
                >
                    <div
                        onClick   = {handleTogglePasswordView}
                        className = {styles.eyeIcon}
                    >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                    </div>
                </InputAdornment>
            </>
        );
    }

    const inputPasswordCN = cx(styles.InputPassword, {
        [props?.className] : props?.className
    });

    return (
        <Input
            {...props}
            className          = {inputPasswordCN}
            inputType          = {showPassword ? 'password' : 'text'}
            renderEndAdornment = {isValueExist ? renderEndAdornment : null}
        />
    );
}


InputPassword.propTypes = {
    className            : PropTypes.string,
    value                : PropTypes.string,
    renderExtraAdornment : PropTypes.func
};

InputPassword.defaultProps = {
    className            : '',
    value                : '',
    renderExtraAdornment : void 0
};

export default InputPassword;

import React, {
    useState
}                               from 'react';
import { useHistory }           from 'react-router-dom';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { LOGIN }                from '../../../constants/routes';

import SvgIcon                  from './../../base/SvgIcon';
import Link                     from './../../base/Link';
import RegisterForm             from './RegisterForm';

import styles                   from './Register.less';

const cx = classnames.bind(styles);

function Register(props) {
    const {
        register, logoProps, passwordPolicy, theme,
        fields, renderCustomContent, renderAuthServices,
        onSuccessRegister, t
    } = props;
    const history = useHistory();

    const [ isProcessing, setIsProcessing ] = useState(false);

    function handleGoToLoginPage() {
        history.push(LOGIN);
    }

    function handleSubmit(callback) {
        return ({ data, onError } = {}) => {
            setIsProcessing(true);

            callback({
                data,
                onError,
                onSuccess : onSuccessRegister,
                onFinally : () => {
                    setIsProcessing(false);
                }
            });
        };
    }

    const LogoComponent = logoProps?.component ? logoProps?.component : SvgIcon;
    const logoType = logoProps?.type ? logoProps?.type : 'logo';

    return (
        <div className={styles.Register}>
            {renderCustomContent ? renderCustomContent() : null}

            <div className={cx(styles.formWrapper)}>
                <div className={styles.logoWrapper}>
                    <LogoComponent
                        type      = {logoType}
                        className = {cx(styles.logo, logoProps?.className)}
                        color     = {logoProps?.color}
                    />
                    { logoProps?.label
                        ? (
                            <div className = {cx(styles.logoLabel, logoProps?.logoLabelCN)}>
                                {logoProps?.label}
                            </div>
                        ) : null
                    }
                </div>
                <RegisterForm
                    onSubmit       = {handleSubmit(register)}
                    isProcessing   = {isProcessing}
                    passwordPolicy = {passwordPolicy}
                    theme          = {theme}
                    fields         = {fields}
                    t              = {t}
                />

                {renderAuthServices ? renderAuthServices() : null}

                <div className={styles.tipBlock}>
                    <Link
                        className    = {cx(styles.tipControl)}
                        onClick      = {handleGoToLoginPage}
                        isProcessing = {isProcessing}
                        isDisabled   = {isProcessing}
                        variant      = 'underline'
                        color        = 'grey'
                    >
                        { t('Already registered?') }
                    </Link>
                </div>
            </div>
        </div>
    );
}

Register.propTypes = {
    register            : PropTypes.func.isRequired,
    t                   : PropTypes.func,
    renderCustomContent : PropTypes.func,
    renderAuthServices  : PropTypes.func,
    onSuccessRegister   : PropTypes.func,
    fields              : PropTypes.arrayOf(PropTypes.shape({
        key   : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        type  : PropTypes.string,
        props : PropTypes.shape({})
    })),
    theme     : PropTypes.oneOf([ 'orange', 'primaryGreen', '' ]),
    logoProps : PropTypes.shape({
        className : PropTypes.string,
        component : PropTypes.any
    }),
    passwordPolicy : PropTypes.any
};

Register.defaultProps = {
    logoProps           : void 0,
    renderCustomContent : void 0,
    renderAuthServices  : void 0,
    onSuccessRegister   : void 0,
    t                   : (text) => text,
    theme               : 'primaryGreen',
    fields              : [ {
        name  : 'login',
        type  : 'string',
        label : 'Email',
        props : {
            autoFocus      : true,
            autoCapitalize : false
        }
    },
    {
        name  : 'password',
        type  : 'passwordStrength',
        label : 'Password',
        props : {
            observeFields   : [ 'login' ],
            extraDictionary : [ 'propuskator' ]
        }
    },
    {
        name  : 'password_retype',
        type  : 'password',
        label : 'Confirm Password',
        props : { }
    } ],
    passwordPolicy : void 0
};

export default Register;

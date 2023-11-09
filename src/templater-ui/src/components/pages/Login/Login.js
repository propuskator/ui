import React, {
    useState
}                               from 'react';
import PropTypes                from 'prop-types';
import { useHistory }           from 'react-router-dom';
import classnames               from 'classnames/bind';

import { REGISTER }             from '../../../constants/routes';

import SvgIcon                  from './../../base/SvgIcon';
import Link                     from './../../base/Link';
import LoginForm                from './LoginForm';

import styles                   from './Login.less';

const cx = classnames.bind(styles);

function Login(props) {
    const {
        login, logoProps, theme, fields, renderCustomContent, renderAuthServices, languageId, onSuccessLogin, t
    } = props;
    const history = useHistory();
    const [ isProcessing, setIsProcessing ] = useState(false);

    function handleGoToRegisterPage() {
        history.push(REGISTER);
    }

    function handleSubmit(callback) {
        return ({ data, onError } = {}) => {
            setIsProcessing(true);

            callback({
                data,
                onError,
                onSuccess : onSuccessLogin,
                onFinally : () => {
                    setIsProcessing(false);
                }
            });
        };
    }

    const LogoComponent = logoProps?.component ? logoProps?.component : SvgIcon;
    const logoType = logoProps?.type ? logoProps?.type : 'logo';

    return (
        <div className={styles.Login}>
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
                <LoginForm
                    onSubmit     = {handleSubmit(login)}
                    isProcessing = {isProcessing}
                    fields        = {fields}
                    theme        = {theme}
                    languageId   = {languageId}
                    t            = {t}
                />

                {renderAuthServices ? renderAuthServices() : null}

                <div className={styles.tipBlock}>
                    <Link
                        className    = {cx(styles.tipControl)}
                        onClick      = {handleGoToRegisterPage}
                        isProcessing = {isProcessing}
                        isDisabled   = {isProcessing}
                        variant      = 'underline'
                        color        = 'grey'
                    >
                        { t('Not registred yet?') }
                    </Link>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    login               : PropTypes.func.isRequired,
    renderCustomContent : PropTypes.func,
    renderAuthServices  : PropTypes.func,
    onSuccessLogin      : PropTypes.func,
    languageId          : PropTypes.string,
    t                   : PropTypes.func,
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
    })
};

Login.defaultProps = {
    logoProps           : void 0,
    renderCustomContent : void 0,
    renderAuthServices  : void 0,
    onSuccessLogin      : void 0,
    languageId          : '',
    t                   : (text) => text,
    theme               : 'primaryGreen',
    fields              : [ {
        key   : 'login',
        label : 'Email',
        type  : 'string',
        props : {
            autoFocus      : true,
            autoCapitalize : false
        }
    }, {
        key   : 'password',
        label : 'Password',
        type  : 'password',
        props : { }
    } ]
};

export default Login;

import React, {
    useState
}                               from 'react';
import { useHistory }           from 'react-router-dom';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { LOGIN }                from '../../../constants/routes';

import SvgIcon                  from './../../base/SvgIcon';
import Link                     from './../../base/Link';
import PasswordChangeForm       from './PasswordChangeForm';
import StatusForm               from './StatusForm';

import styles                   from './PasswordChange.less';

const cx = classnames.bind(styles);

function PasswordChange(props) {
    const {
        passwordChange, logoProps, theme, fields, t
    } = props;
    const history = useHistory();

    const [ step, setStep ] = useState('form'); // [ 'form', 'success' ]
    const [ isProcessing, setIsProcessing ] = useState(false);

    const token = history?.location?.query?.t;

    function handleGoToLoginPage() {
        history.push(LOGIN);
    }

    function handleSubmit(callback) {
        return ({ data, onError, onSuccess } = {}) => {
            setIsProcessing(true);

            callback({
                data,
                onSuccess : (response) => {
                    setStep('success');
                    if (onSuccess) onSuccess(response);
                },
                onError,
                onFinally : () => {
                    setIsProcessing(false);
                }
            });
        };
    }

    const LogoComponent = logoProps?.component ? logoProps?.component : SvgIcon;
    const logoType = logoProps?.type ? logoProps?.type : 'logo';

    return (
        <div className={styles.PasswordChange}>
            <div className={cx(styles.formWrapper)}>
                { step === 'form'
                    ? (
                        <>
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
                            <PasswordChangeForm
                                onSubmit     = {handleSubmit(passwordChange)}
                                isProcessing = {isProcessing}
                                fields       = {fields}
                                theme        = {theme}
                                t            = {t}
                                token        = {token}
                            />
                            <div className={styles.tipBlock}>
                                <Link
                                    className    = {cx(styles.tipControl)}
                                    onClick      = {handleGoToLoginPage}
                                    isProcessing = {isProcessing}
                                    isDisabled   = {isProcessing}
                                    variant      = 'underline'
                                    color        = 'grey'
                                >
                                    { t('Back to Login') }
                                </Link>
                            </div>
                        </>
                    ) : (
                        <StatusForm
                            type         = 'success'
                            theme        = {theme}
                            t            = {t}
                            isProcessing = {isProcessing}
                            onResend     = {handleSubmit(passwordChange)}
                        />
                    )
                }
            </div>
        </div>
    );
}

PasswordChange.propTypes = {
    passwordChange : PropTypes.func.isRequired,
    t              : PropTypes.func,
    fields         : PropTypes.arrayOf(PropTypes.shape({
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

PasswordChange.defaultProps = {
    logoProps : void 0,
    t         : (text) => text,
    theme     : 'primaryGreen',
    fields    : [ {
        key   : 'password',
        label : 'New password',
        type  : 'passwordStrength',
        props : {
            autoFocus      : true,
            autoCapitalize : false
        }
    }, {
        key   : 'password_retype',
        label : 'Confirm Password',
        type  : 'password',
        props : {}
    } ]
};

export default PasswordChange;

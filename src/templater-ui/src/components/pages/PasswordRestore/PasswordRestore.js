import React, {
    useState
}                               from 'react';
import { useHistory }           from 'react-router-dom';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { LOGIN }                from '../../../constants/routes';

import SvgIcon                  from './../../base/SvgIcon';
import Link                     from './../../base/Link';
import PasswordRestoreForm      from './PasswordRestoreForm';
import StatusForm               from './StatusForm';

import styles                   from './PasswordRestore.less';

const cx = classnames.bind(styles);

function PasswordRestore(props) {
    const {
        passwordRestore, logoProps, theme, fields, emailKey,
        t, addToast, renderCustomContent
    } = props;
    const history = useHistory();

    const [ step, setStep ] = useState('form'); // [ 'form', 'success' ]
    const [ email, setEmail ] = useState('');

    const [ isProcessing, setIsProcessing ] = useState(false);

    function handleGoToLoginPage() {
        history.push(LOGIN);
    }

    function handleSubmit(callback) {
        return ({ data, onError, onSuccess } = {}) => {
            setIsProcessing(true);

            setEmail(data?.[emailKey]);

            callback({
                data,
                onSuccess : (response) => {
                    if (step !== 'success') setStep('success');
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
        <div className={styles.PasswordRestore}>
            {renderCustomContent ? renderCustomContent() : null}

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
                            <PasswordRestoreForm
                                onSubmit     = {handleSubmit(passwordRestore)}
                                isProcessing = {isProcessing}
                                fields       = {fields}
                                theme        = {theme}
                                t            = {t}
                            />
                        </>
                    ) : (
                        <StatusForm
                            type         = 'success'
                            theme        = {theme}
                            isProcessing = {isProcessing}
                            onResend     = {handleSubmit(passwordRestore)}
                            email        = {email}
                            emailKey     = {emailKey}
                            t            = {t}
                            addToast     = {addToast}
                        />
                    )
                }
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
            </div>
        </div>
    );
}

PasswordRestore.propTypes = {
    passwordRestore     : PropTypes.func.isRequired,
    renderCustomContent : PropTypes.func,
    t                   : PropTypes.func,
    fields              : PropTypes.arrayOf(PropTypes.shape({
        key   : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        type  : PropTypes.string,
        props : PropTypes.shape({})
    })),
    emailKey  : PropTypes.oneOf([ 'login', 'email' ]),
    theme     : PropTypes.oneOf([ 'orange', 'primaryGreen', '' ]),
    logoProps : PropTypes.shape({
        className : PropTypes.string,
        component : PropTypes.any
    }),
    addToast : PropTypes.func
};

PasswordRestore.defaultProps = {
    logoProps           : void 0,
    renderCustomContent : void 0,
    t                   : (text) => text,
    emailKey            : 'email',
    theme               : 'primaryGreen',
    fields              : [ {
        key   : 'email',
        label : 'Enter your email',
        type  : 'string',
        props : {
            autoFocus      : true,
            autoCapitalize : false
        }
    } ],
    addToast : void 0
};

export default PasswordRestore;

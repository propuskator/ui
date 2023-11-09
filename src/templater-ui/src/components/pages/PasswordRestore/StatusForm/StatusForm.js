/* eslint-disable  babel/no-unused-expressions */
import React, {
    useState,
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { TOASTS_KEYS }          from '../../../../constants/toasts';
import CustomForm               from '../../../shared/CustomForm';
import SvgIcon                  from '../../../base/SvgIcon';
import Typography               from '../../../base/Typography';

import styles                   from './StatusForm.less';

const cx = classnames.bind(styles);


function StatusForm(props) {    // eslint-disable-line max-lines-per-function
    const { onResend, isProcessing, theme, t, email, emailKey, addToast } = props;
    const [ error, setError ] = useState();

    function formDataFormatter(data) {
        // pass

        return data.value;
    }

    function handleInteract(fieldName) {
        setError(prev => {
            return {
                ...prev,
                serverError : '',
                errors      : {
                    ...(prev?.errors || {}),
                    [fieldName] : ''
                }
            };
        });
    }

    async function handleSubmit() {
        setError(void 0);

        onResend({
            data : {
                [emailKey] : email
            },
            onSuccess : () => {
                if (!addToast) return;

                addToast({
                    key                  : TOASTS_KEYS.passwordRestore,
                    title                : t('Action was completed successfully'),
                    message              : t('Letter has been resent. Please check your email.'),
                    showOnSessionDestroy : true,
                    type                 : 'success'
                });
            },
            onError : (err) => {
                if ([ 'forbidden' ].includes(err?.type)) {
                    setError(err);
                    if (!addToast) return;
                    addToast({
                        key                  : TOASTS_KEYS.passwordRestore,
                        title                : t('Action was not completed successfully'),
                        message              : t('Letter hasn\'t been resent.'),
                        showOnSessionDestroy : true,
                        type                 : 'error'
                    });
                } else {
                    setError({ serverError: t('Something went wrong') });

                    if (!addToast) return;

                    addToast({
                        key                  : TOASTS_KEYS.passwordRestore,
                        title                : t('Action was not completed successfully'),
                        message              : t('Letter hasn\'t been resent.'),
                        showOnSessionDestroy : true,
                        type                 : 'error'
                    });
                }
            }
        });
    }

    return (
        <CustomForm
            className     = {styles.StatusForm}
            configuration = {useMemo(() => ({
                name   : 'statusForm',
                fields : [
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <div className={cx(styles.iconWrapper, { [theme]: theme })} key='icon'>
                                    <SvgIcon
                                        type      = 'email'
                                        className = {styles.icon}
                                    />
                                </div>
                            );
                        }
                    },
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <Typography
                                    className = {styles.title}
                                    variant   = 'headline3'
                                    key       = 'title'
                                >
                                    {t('Check your email')}
                                </Typography>
                            );
                        }
                    },
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <Typography
                                    className = {styles.description}
                                    variant   = 'body1'
                                    key       = 'description'
                                >
                                    {t('We sent a verification email to ')}<b>{email}</b>
                                    {t('. Please tap the link inside that email to continue.')}
                                </Typography>
                            );
                        }
                    }
                ],
                controls : {
                    submit : {
                        title : t('Resend email'),
                        props : {
                            size      : 'L',
                            className : styles.submitButton,
                            color     : theme || 'primaryGreen'
                        }
                    }
                }
            }), [ error, t ])}
            initialState  = {useMemo(() => {}, [])}
            isProcessing  = {isProcessing}
            errors        = {error?.errors}
            commonError   = {error?.serverError}
            onSubmit      = {useCallback(handleSubmit, [])}
            onInteract    = {useCallback(handleInteract, [])}
            formatter     = {useCallback(formDataFormatter, [])}
            withCommonError
        />
    );
}

StatusForm.propTypes = {
    onResend     : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    theme        : PropTypes.oneOf([ 'orange', 'primaryGreen' ]).isRequired,
    t            : PropTypes.func.isRequired,
    emailKey     : PropTypes.oneOf([ 'login', 'email' ]).isRequired,
    email        : PropTypes.string.isRequired,
    addToast     : PropTypes.func
};

StatusForm.defaultProps = {
    isProcessing : false,
    addToast     : void 0
};

export default StatusForm;

/* eslint-disable  babel/no-unused-expressions */
import React, {
    useState,
    useMemo,
    useCallback,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import { useHistory }           from 'react-router-dom';

import { PASSWORD_RESTORE }     from '../../../../constants/routes';
import CustomForm               from '../../../shared/CustomForm';
import Link                     from '../../../base/Link';

import styles                   from './LoginForm.less';


function LoginForm(props) {
    const { onSubmit, isProcessing, theme, fields, languageId, t } = props;
    const [ error, setError ] = useState();
    const history = useHistory();

    useEffect(() => {
        setError(prev => ({
            ...prev,
            serverError : '',
            errors      : {}
        }));
    }, [ languageId ]);

    function formDataFormatter(data) {
        const { name, value } = data || {};

        switch (name) {
            case 'login':
                return value?.trim() || '';
            default:
                return value;
        }
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

    async function handleSubmit(data) {
        onSubmit({
            data,
            onError : (err) => {
                const { type, serverError } = err;

                if (type === 'validation') setError(err);
                else if (type === 'forbidden') setError({ serverError });
                else setError({ serverError: t('Server Error') });
            }
        });
    }

    function handleForgotPassword() {
        history.push(PASSWORD_RESTORE);
    }

    function getInitialStateByFields() {
        const initialState = {};

        fields?.forEach(field => initialState[field?.key] = '');

        return initialState;
    }

    return (
        <CustomForm
            t             = {t}
            className     = {styles.LoginForm}
            configuration = {useMemo(() => ({
                name   : 'loginForm',
                fields : [
                    ...fields?.map(field => ({
                        name  : field?.key,
                        type  : 'string',
                        ...field,
                        props : {
                            ...(field?.props),
                            isInvalid : !!error?.serverError
                        }
                    })) || [],
                    {
                        name              : 'customField',
                        type              : 'customField',
                        renderCustomField : () => {
                            return (
                                <div className={styles.tipsBlock} key='tipsBlock'>
                                    <Link
                                        className = {styles.forgotTip}
                                        color     = 'grey'
                                        variant   = 'underline'
                                        onClick   = {handleForgotPassword}
                                    >
                                        {t('Forgot password?')}
                                    </Link>
                                </div>
                            );
                        }
                    }
                ],
                controls : {
                    submit : {
                        title : t('Sign In'),
                        props : {
                            size      : 'L',
                            className : styles.submitButton,
                            color     : theme || 'primaryGreen'
                        }
                    }
                }
            }), [ error, fields ])}
            initialState  = {useMemo(getInitialStateByFields, [])}
            isProcessing  = {isProcessing}
            errors        = {error?.errors}
            commonError   = {t(error?.serverError)}
            onSubmit      = {useCallback(handleSubmit, [])}
            onInteract    = {useCallback(handleInteract, [])}
            formatter     = {useCallback(formDataFormatter, [])}
            withCommonError
        />
    );
}

LoginForm.propTypes = {
    onSubmit     : PropTypes.func.isRequired,
    languageId   : PropTypes.string.isRequired,
    t            : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    theme        : PropTypes.oneOf([ 'orange', 'primaryGreen' ]).isRequired,
    fields       : PropTypes.arrayOf(PropTypes.shape({
        key   : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        type  : PropTypes.string,
        props : PropTypes.shape({})
    })).isRequired
};

LoginForm.defaultProps = {
    isProcessing : false
};

export default LoginForm;

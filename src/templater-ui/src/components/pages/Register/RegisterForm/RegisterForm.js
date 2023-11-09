/* eslint-disable  babel/no-unused-expressions */
import React, {
    useState,
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';

import CustomForm               from './../../../shared/CustomForm';
// import { PASSWORD_POLICY }      from './../../../../constants';

import styles                   from './RegisterForm.less';


function RegisterForm(props) {
    const {
        onSubmit, isProcessing,
        theme, fields, t /* , passwordPolicy */
    } = props;
    const [ error, setError ]        = useState();

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
                if (err?.type === 'validation') setError(err);
                else setError({ serverError: t('Server Error') });
            }
        });
    }

    function getInitialStateByFields() {
        const initialState = {};

        fields?.forEach(field => initialState[field?.key] = '');

        return initialState;
    }

    return (
        <CustomForm
            t             = {t}
            className     = {styles.RegisterForm}
            configuration = {useMemo(() => ({
                name   : 'changePassword',
                fields : [
                    ...(fields?.map(field => ({
                        name  : field?.key,
                        type  : 'string',
                        ...field,
                        props : {
                            ...(field?.props),
                            isInvalid : !!error?.serverError
                        }
                    })) || [])
                    // {
                    //     name              : 'customField',
                    //     type              : 'customField',
                    //     renderCustomField : () => {
                    //         return (
                    //             <div className={styles.passwordPolicy} key='passwordPolicy'>
                    //                 *{passwordPolicy}
                    //             </div>
                    //         );
                    //     }
                    // }
                ],
                controls : {
                    submit : {
                        title : t('Sign Up'),
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
            commonError   = {error?.serverError}
            onSubmit      = {useCallback(handleSubmit, [])}
            onInteract    = {useCallback(handleInteract, [])}
            formatter     = {useCallback(formDataFormatter, [])}
            withCommonError
        />
    );
}

RegisterForm.propTypes = {
    onSubmit     : PropTypes.func.isRequired,
    t            : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    theme        : PropTypes.oneOf([ 'orange', 'primaryGreen' ]).isRequired,
    fields       : PropTypes.arrayOf(PropTypes.shape({
        key   : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        type  : PropTypes.string,
        props : PropTypes.shape({})
    })).isRequired
    // passwordPolicy : PropTypes.any
};

RegisterForm.defaultProps = {
    isProcessing : false
    // passwordPolicy : PASSWORD_POLICY
};

export default RegisterForm;

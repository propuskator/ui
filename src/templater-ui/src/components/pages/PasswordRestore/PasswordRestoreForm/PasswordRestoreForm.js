/* eslint-disable  babel/no-unused-expressions */
import React, {
    useState,
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';

import CustomForm               from './../../../shared/CustomForm';

import styles                   from './PasswordRestoreForm.less';


function PasswordRestoreForm(props) {
    const { onSubmit, isProcessing, theme, fields, t } = props;
    const [ error, setError ]        = useState();

    function formDataFormatter(data) {
        const { name, value } = data || {};

        switch (name) {
            case 'login':
            case 'email':
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
        setError(void 0);

        onSubmit({
            data,
            onError : (err) => {
                if ([ 'validation', 'forbidden' ].includes(err?.type)) setError(err);
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
            className     = {styles.PasswordRestoreForm}
            classes       = {{
                form : styles.form
            }}
            configuration = {useMemo(() => ({
                title  : t('Reset Password'),
                name   : 'passwordRestoreForm',
                fields : fields?.map(field => ({
                    name  : field?.key,
                    type  : 'string',
                    ...field,
                    props : {
                        ...(field?.props),
                        isInvalid : !!error?.serverError
                    }
                })) || [],
                controls : {
                    submit : {
                        title : t('Restore'),
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

PasswordRestoreForm.propTypes = {
    onSubmit     : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    theme        : PropTypes.oneOf([ 'orange', 'primaryGreen' ]).isRequired,
    fields       : PropTypes.arrayOf(PropTypes.shape({
        key   : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        type  : PropTypes.string,
        props : PropTypes.shape({})
    })).isRequired,
    t : PropTypes.func.isRequired
};

PasswordRestoreForm.defaultProps = {
    isProcessing : false
};

export default PasswordRestoreForm;

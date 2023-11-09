/* eslint-disable  babel/no-unused-expressions */
import React, {
    useState,
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';

import CustomForm               from './../../../shared/CustomForm';

import styles                   from './PasswordChangeForm.less';


function PasswordChangeForm(props) {
    const { onSubmit, isProcessing, theme, fields, t, token } = props;
    const [ error, setError ]        = useState();

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

    async function handleSubmit(data) {
        onSubmit({
            data : {
                ...(data || {}),
                token
            },
            onError : (err) => {
                if (err?.type === 'validation') setError(err);
                else if (err?.type === 'forbidden') {
                    setError({ serverError: t('Invalid token') });
                } else setError({ serverError: t('Server Error') });
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
            className     = {styles.PasswordChangeForm}
            classes       = {{
                form : styles.form
            }}
            configuration = {useMemo(() => ({
                title  : t('Create new password'),
                name   : 'passwordChangeForm',
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
                        title : t('Save'),
                        props : {
                            size      : 'L',
                            className : styles.submitButton,
                            color     : theme || 'primaryGreen'
                        }
                    }
                }
            }), [ error ])}
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

PasswordChangeForm.propTypes = {
    onSubmit     : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    theme        : PropTypes.oneOf([ 'orange', 'primaryGreen' ]).isRequired,
    fields       : PropTypes.arrayOf(PropTypes.shape({
        key   : PropTypes.string.isRequired,
        label : PropTypes.string.isRequired,
        type  : PropTypes.string,
        props : PropTypes.shape({})
    })).isRequired,
    token : PropTypes.string,
    t     : PropTypes.func.isRequired
};

PasswordChangeForm.defaultProps = {
    isProcessing : false,
    token        : void 0
};

export default PasswordChangeForm;

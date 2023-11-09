import React, {
    useMemo,
    useCallback,
    useState,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { TOASTS_KEYS }          from './../../../../constants/toasts';
// import { PASSWORD_POLICY }      from './../../../../constants/index';
import CustomForm               from './../../../shared/CustomForm';
import Typography               from './../../../base/Typography';

import { INITIAL_FORM_STATE,
    getDefaultConfiguration }   from './data';

import styles                   from './ChangePasswordForm.less';

const cx = classnames.bind(styles);

function ChangePasswordForm(props) { // eslint-disable-line max-lines-per-function
    const { addToast, updateAccountSettings, t, languageId,
        initialState, getConfiguration, titleVariant, ...rest } = props;

    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errors, setErrors ]             = useState({});
    const formRef                           = useRef({});
    const componentRef                      = useRef({});

    const formInitialState = useMemo(() => ({ ...initialState }), []);
    const formConfiguration = useMemo(
        () => getConfiguration
            ? getConfiguration({ t, styles })
            : getDefaultConfiguration({ t, styles })
        , [ languageId ]
    );

    function formDataFormatter(data) {
        // pass
        return data.value;
    }

    function resetFormValue() {
        const ref = formRef?.current;

        if (!ref?.setFormData) return;

        ref.setFormData({    // eslint-disable-line no-unused-expressions
            ...formInitialState
        });
    }

    async function handleSubmit(data) {
        if (componentRef.current.isProcessing) return;
        componentRef.current.isProcessing = true;   // eslint-disable-line more/no-duplicated-chains
        setIsProcessing(true);

        updateAccountSettings({
            data,
            onSuccess : () => {
                addToast({
                    key     : TOASTS_KEYS.acoountSettingsUpdate,
                    title   : t('Action was completed successfully'),
                    message : t('Password has been updated'),
                    type    : 'success'
                });
                setErrors({});
                resetFormValue();
            },
            onError : (error) => {
                setErrors(error?.errors || {});
            },
            onFinally : () => {
                setIsProcessing(false);
                componentRef.current.isProcessing = false;  // eslint-disable-line more/no-duplicated-chains, require-atomic-updates, max-len
            }
        });
    }

    function handleInteract(name) {
        setErrors(prevState => ({
            ...prevState,
            [name] : null
        }));
    }
    const changePasswordFormCN = cx(styles.ChangePasswordForm);

    return (
        <div className={changePasswordFormCN}>
            <Typography variant={titleVariant} className={styles.title}>
                {t('Change password')}
            </Typography>

            <CustomForm
                {...rest}
                className = {styles.passwordForm}
                configuration = {formConfiguration}
                initialState  = {formInitialState}
                isProcessing  = {isProcessing}
                errors        = {errors}
                onSubmit      = {useCallback(handleSubmit, [])}
                onInteract    = {useCallback(handleInteract, [])}
                formatter     = {useCallback(formDataFormatter, [])}
                forwardRef    = {formRef}
                t             = {t}
            />
        </div>
    );
}

ChangePasswordForm.propTypes = {
    updateAccountSettings : PropTypes.func.isRequired,
    addToast              : PropTypes.func.isRequired,
    getConfiguration      : PropTypes.func,
    t                     : PropTypes.func,
    languageId            : PropTypes.string,
    titleVariant          : PropTypes.string,
    initialState          : PropTypes.shape({})
};

ChangePasswordForm.defaultProps = {
    t                : (text) => text,
    getConfiguration : void 0,
    languageId       : void 0,
    titleVariant     : 'headline3',
    initialState     : INITIAL_FORM_STATE
};

export default React.memo(ChangePasswordForm);

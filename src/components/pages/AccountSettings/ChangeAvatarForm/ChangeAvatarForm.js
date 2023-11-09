/* eslint-disable babel/no-unused-expressions */
import React, {
    useMemo,
    useCallback,
    useState,
    useRef,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import CustomForm               from 'Shared/CustomForm';

import styles                   from './ChangeAvatarForm.less';

const cx = classnames.bind(styles);

function ChangeAvatarForm(props) {
    const {
        addToast,
        updateUserAvatar,
        avatar,
        t,
        languageId
    } = props;
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errors, setErrors ]             = useState({});
    const formRef                           = useRef({});
    const componentRef                      = useRef({});

    useEffect(() => {
        formRef?.current?.setFormData({
            avatarImg : avatar
        });
    }, [ avatar ]);

    function handleChangeAvatar({ value }) {
        handleSubmit({ avatarImg: value });
    }

    function resetFormValue() {
        /* TODO: check this case
        formRef?.current?.setFormData({
            login : ''
        });*/
    }

    async function handleSubmit(data) {
        if (componentRef.current.isProcessing) return;
        componentRef.current.isProcessing = true;   // eslint-disable-line more/no-duplicated-chains
        setIsProcessing(true);
        try {
            const payload = data;

            await updateUserAvatar(payload);

            // addToast({
            //     key     : TOASTS_KEYS.acoountSettingsUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : t('Avatar has been updated'),
            //     type    : 'success'
            // });

            setErrors({});
        } catch (error) {
            const fields = { };

            error?.errors?.forEach(element => fields[element.field] = element.message);

            setErrors(fields);

            resetFormValue();
        } finally {
            setIsProcessing(false);
            componentRef.current.isProcessing = false;   // eslint-disable-line more/no-duplicated-chains, require-atomic-updates, max-len
        }
    }

    function handleInteract(name) {
        setErrors(prevState => ({
            ...prevState.errors,
            [name] : null
        }));
    }

    const changeAvatarFormCN = cx(styles.ChangeAvatarForm);

    return (
        <div className={changeAvatarFormCN}>
            <CustomForm
                configuration = {useMemo(() => ({
                    name   : 'changeAvatar',
                    fields : [
                        {
                            name    : 'avatarImg',
                            type    : 'avatar',
                            label   : t('Change avatar'),
                            default : '',
                            props   : {
                                label    : t('settings:Workspace avatar'),
                                onChange : handleChangeAvatar,
                                key      : 'avatarImg',
                                addToast,
                                t
                            }
                        }
                    ]
                }), [ languageId ])}
                initialState  = {useMemo(() => ({
                    avatarImg : avatar
                }), [ ])}
                isProcessing  = {isProcessing}
                errors        = {errors}
                onSubmit      = {useCallback(handleSubmit, [])}
                onInteract    = {useCallback(handleInteract, [])}
                forwardRef    = {formRef}
            />
        </div>
    );
}

ChangeAvatarForm.propTypes = {
    avatar           : PropTypes.string,
    addToast         : PropTypes.func.isRequired,
    updateUserAvatar : PropTypes.func.isRequired,
    t                : PropTypes.func.isRequired,
    languageId       : PropTypes.string.isRequired
};

ChangeAvatarForm.defaultProps = {
    avatar : ''
};

export default React.memo(ChangeAvatarForm);

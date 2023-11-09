/* eslint-disable  babel/no-unused-expressions */
import React, {
    useMemo,
    useCallback,
    useState,
    useRef,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { TOASTS_KEYS }          from './../../../../constants/toasts';
import CustomForm               from './../../../shared/CustomForm';

import styles                   from './ChangeAvatarForm.less';

const cx = classnames.bind(styles);

function ChangeAvatarForm(props) {
    const {
        className,
        addToast,
        updateUserAvatar,
        avatar,
        t,
        languageId,
        defaultAvatarType
    } = props;
    const [ isProcessing, setIsProcessing ] = useState(false);
    const [ errors, setErrors ]             = useState({});
    const formRef                           = useRef({});
    const componentRef                      = useRef({});

    useEffect(() => {
        const formState = formRef?.current?.getValue();

        if (formState?.avatarImg) return;

        formRef?.current?.setFormData({
            avatarImg : avatar
        });
    }, [ avatar ]);

    function handleChangeAvatar({ value }) {
        handleSubmit({ avatarImg: value });

        formRef?.current?.setFormData({
            avatarImg : value
        });
    }

    async function handleSubmit(data) {
        if (componentRef.current.isProcessing) return;
        componentRef.current.isProcessing = true;   // eslint-disable-line more/no-duplicated-chains
        setIsProcessing(true);
        updateUserAvatar({
            data,
            onSuccess : () => {
                // addToast({
                //     key     : TOASTS_KEYS.acoountSettingsUpdate,
                //     title   : t('Action was completed successfully'),
                //     message : t('Avatar has been updated'),
                //     type    : 'success'
                // });

                setErrors({});
            },
            onError : (error) => {
                formRef?.current?.setFormData({
                    avatarImg : avatar || ''
                });
                setErrors(error?.errors);

                addToast({
                    key     : TOASTS_KEYS.acoountSettingsUpdate,
                    title   : t('Action was not completed successfully'),
                    message : t('Avatar hasn\'t been updated'),
                    type    : 'error'
                });
            },
            onFinally : () => {
                setIsProcessing(false);
                componentRef.current.isProcessing = false;   // eslint-disable-line more/no-duplicated-chains, require-atomic-updates, max-len
            }
        });
    }

    function handleInteract(name) {
        setErrors(prevState => ({
            ...prevState,
            [name] : null
        }));
    }

    const changeAvatarFormCN = cx(styles.ChangeAvatarForm, { [className]: className });

    return (
        <div className={changeAvatarFormCN}>
            <CustomForm
                configuration = {useMemo(() => ({
                    name   : 'changeAvatar',
                    fields : [
                        {
                            name    : 'avatarImg',
                            type    : 'avatar',
                            default : '',
                            props   : {
                                pictureVariant : defaultAvatarType,
                                label          : t('Change avatar'),
                                onChange       : handleChangeAvatar,
                                key            : 'avatarImg',
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
                onSubmit      = {useCallback(handleSubmit, [ avatar ])}
                onInteract    = {useCallback(handleInteract, [])}
                forwardRef    = {formRef}
                addToast      = {addToast}
            />
        </div>
    );
}

ChangeAvatarForm.propTypes = {
    className         : PropTypes.string,
    avatar            : PropTypes.string,
    addToast          : PropTypes.func.isRequired,
    updateUserAvatar  : PropTypes.func.isRequired,
    languageId        : PropTypes.string,
    t                 : PropTypes.func,
    defaultAvatarType : PropTypes.string
};

ChangeAvatarForm.defaultProps = {
    className         : '',
    avatar            : '',
    languageId        : void 0,
    t                 : (text) => text,
    defaultAvatarType : void 0
};

export default React.memo(ChangeAvatarForm);

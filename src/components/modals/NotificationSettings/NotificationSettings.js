import React, {
    useCallback,
    useEffect,
    useState
}                           from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';
import i18n                 from 'i18next';

import Loader               from 'templater-ui/src/components/base/Loader';
import IconButton           from 'templater-ui/src/components/base/IconButton/IconButton';
import Typography           from 'templater-ui/src/components/base/Typography';
import CustomForm           from 'Shared/CustomForm';

import { TOASTS_KEYS }      from 'Constants/toasts';
import api                  from 'ApiSingleton';

import styles               from './NotificationSettings.less';

const cx = classnames.bind(styles);

// eslint-disable-next-line max-lines-per-function
function NotificationSettings(props) {
    const {
        workspaceNotifications, updateWorkspaceSettings, name, level, isTopModal, addToast,  closeModal, t
    } = props;

    const [ fields, setFields ] = useState([]);
    const [ initialState, setInitialState ] = useState({});
    const [ isFetching, setIsFetching ] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState(false);

    useEffect(() => {
        fetchModalData();
    }, []);

    async function fetchModalData() {
        try {
            setIsFetching(true);

            const { data: types } = await api.references.getByName('notification_types');
            const lang = i18n?.language;

            const initialFormState = types.reduce((acc, curr) => ({
                ...acc,
                [curr?.name] : workspaceNotifications.includes(curr?.name)
            }), {});

            // eslint-disable-next-line no-shadow
            const formConfiguration = types.map(({ label, name } = {}) => createFieldConfig(label[lang], name));

            setInitialState(initialFormState);
            setFields(formConfiguration);
        } catch (e) {
            console.log('Error', e);
        } finally {
            setIsFetching(false);
        }
    }

    function createFieldConfig(label, fieldName) {
        return {
            label,
            name      : fieldName,
            type      : 'switch',
            default   : '',
            className : styles.fieldWrapper,
            props     : {
                key       : fieldName,
                withError : false,
                classes   : {
                    label : styles.switchLabel
                }
            }
        };
    }

    const handleSubmit = useCallback(async valuesObj => {
        try {
            setIsProcessing(true);
            const values = Object.keys(valuesObj).filter(key => !!valuesObj[key]);

            await updateWorkspaceSettings({
                notificationTypes : values
            });

            // addToast({
            //     key     : TOASTS_KEYS.accountNotificationsSettings,
            //     title   : t('Action was completed successfully'),
            //     message : t('settings:Notification settings updated'),
            //     type    : 'success'
            // });

            handleCloseModal();
        } catch (e) {
            addToast({
                key     : TOASTS_KEYS.accountNotificationsSettings,
                title   : t('Something went wrong'),
                message : t('settings:Notification settings hasn\'t been updated'),
                type    : 'error'
            });
        } finally {
            setIsProcessing(false);
        }
    }, []);

    function handleCloseModal() {
        closeModal(name);
    }

    const notificationSettingsCN = cx(styles.NotificationSettings, {
        [`${level}Level`] : level,
        topModal          : isTopModal
    });

    return (
        <div className={notificationSettingsCN}>
            <IconButton
                className = {styles.closeButton}
                iconType  = 'cross'
                onClick   = {handleCloseModal}
            />
            <Typography
                className = {styles.title}
                variant   = 'headline3'
                color     = 'black'
            >
                {t('settings:Notification settings')}
            </Typography>

            <div className={styles.content}>
                {
                    isFetching
                        ? (
                            <div className={styles.loaderWrapper}>
                                <Loader size = 'S' />
                            </div>
                        )
                        : (
                            <CustomForm
                                initialState  = {initialState}
                                isProcessing  = {isProcessing}
                                onSubmit      = {handleSubmit}
                                configuration = {{
                                    fields,
                                    name     : 'notificationSettings',
                                    controls : {
                                        submit : {
                                            title : t('Update'),
                                            props : {
                                                className : styles.submitButton,
                                                color     : 'primary600'
                                            }
                                        }
                                    }
                                }}
                            />
                        )
                }
            </div>
        </div>
    );
}

NotificationSettings.propTypes = {
    workspaceNotifications  : PropTypes.arrayOf(PropTypes.string),
    name                    : PropTypes.string.isRequired,
    isTopModal              : PropTypes.bool,
    level                   : PropTypes.oneOf([ 'first', 'second' ]),
    addToast                : PropTypes.func.isRequired,
    closeModal              : PropTypes.func.isRequired,
    updateWorkspaceSettings : PropTypes.func.isRequired,
    t                       : PropTypes.func
};

NotificationSettings.defaultProps = {
    workspaceNotifications : [],
    isTopModal             : false,
    level                  : 'first',
    t                      : text => text
};

export default NotificationSettings;

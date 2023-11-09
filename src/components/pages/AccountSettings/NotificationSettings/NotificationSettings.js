import React, { useCallback }   from 'react';
import PropTypes                from 'prop-types';

import Typography               from 'templater-ui/src/components/base/Typography';
import Button                   from 'templater-ui/src/components/base/Button';

import styles                   from './NotificationSettings.less';

function NotificationSettings(props) {
    const { openModal, t } = props;

    const handleOpenModal = useCallback(() => openModal('notificationSettings'), [ openModal ]);

    return (
        <div className={styles.NotificationSettings}>
            <Typography variant='headline3'>
                {t('settings:Notification settings')}
            </Typography>

            <Typography
                variant   = 'body1'
                color     = 'greyDark'
                className = {styles.text}
            >
                {t('settings:Select the types of received notifications')}
            </Typography>

            <Button
                size      = 'L'
                color     = 'actionButton'
                className = {styles.submitButton}
                onClick   = {handleOpenModal}
            >
                {t('settings:Setup')}
            </Button>
        </div>
    );
}

NotificationSettings.propTypes = {
    openModal : PropTypes.func,
    t         : PropTypes.func
};

NotificationSettings.defaultProps = {
    openModal : void 0,
    t         : (text) => text
};

export default NotificationSettings;

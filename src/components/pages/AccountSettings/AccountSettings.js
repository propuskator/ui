import React                    from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Typography               from 'templater-ui/src/components/base/Typography';
import ReportForm               from 'templater-ui/src/components/pages/AccountSettings/Report';

import pageStyles               from '../styles.less';
import ChangeAvatarForm         from './ChangeAvatarForm';
import MainInfo                 from './MainInfo';
import ChangePasswordForm       from './ChangePasswordForm';
import ChangeTimezoneForm       from './ChangeTimezoneForm';
import SystemInfo               from './SystemInfo';
import NotificationSettings     from './NotificationSettings';

import styles                   from './AccountSettings.less';

const cx = classnames.bind(styles);

function AccountSettings(props) {
    const {
        t
    } = props;

    return (
        <div className={cx(styles.AccountSettings)}>
            <div className={pageStyles.pageContent}>
                <Typography
                    variant   = 'headline2'
                    color     = 'primary900'
                    className = {cx(pageStyles.pageTitle, styles.pageTitle)}
                >
                    {t('Account settings')}
                </Typography>

                <div className={styles.formsWrapper}>
                    <div className={styles.formWrapper}>
                        <ChangeAvatarForm {...props} />
                        <MainInfo {...props} />
                    </div>
                    <div className={styles.formWrapper}>
                        <ChangePasswordForm {...props} />
                    </div>
                    <div className={styles.formWrapper}>
                        <ReportForm
                            {...props}
                            subtitle = {t('Tell us about your suggestions or comments for the Propuskator application work')}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <ChangeTimezoneForm {...props} />
                    </div>
                    <div className={styles.formWrapper}>
                        <SystemInfo {...props} />
                    </div>
                    <div className={styles.formWrapper}>
                        <NotificationSettings {...props} />
                    </div>
                </div>
            </div>
        </div>
    );
}

AccountSettings.propTypes = {
    t              : PropTypes.func,
    changeLanguage : PropTypes.func,
    languageId     : PropTypes.string
};

AccountSettings.defaultProps = {
    t              : (text) => text,
    changeLanguage : void 0,
    languageId     : void 0
};

export default AccountSettings;

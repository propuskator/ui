import React                    from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Typography               from './../../base/Typography';

import pageStyles         from './../styles.less';
import ChangeAvatarForm   from './ChangeAvatarForm';
import MainInfo           from './MainInfo';
import ChangePasswordForm from './ChangePasswordForm';
import SystemInfo         from './SystemInfo';
import Report             from './Report';

import styles             from './AccountSettings.less';

const cx = classnames.bind(styles);

function AccountSettings(props) {
    const {
        addToast,
        openModal,
        updateUserAvatar,
        updatePassword,
        login,
        avatar,
        id,
        t,
        customForms
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
                        <ChangeAvatarForm
                            {...props}
                            className        = {styles.changeAvatarForm}
                            avatar           = {avatar}
                            addToast         = {addToast}
                            updateUserAvatar = {updateUserAvatar}
                        />
                        <MainInfo
                            {...props}
                            id    = {id}
                            login = {login}
                        />
                    </div>

                    <div className={styles.formWrapper}>
                        <ChangePasswordForm
                            {...props}
                            addToast              = {addToast}
                            updateAccountSettings = {updatePassword}
                        />
                    </div>

                    <div className={styles.formWrapper}>
                        <SystemInfo
                            {...props}
                            openModal = {openModal}
                        />
                    </div>

                    <div className={styles.formWrapper}>
                        <Report
                            {...props}
                        />
                    </div>
                    { customForms?.length
                        ? customForms?.map(({ id : componentKey, component } = {}) => (
                            <div className={styles.formWrapper} key={componentKey}>
                                {component}
                            </div>
                        )) : null
                    }
                </div>
            </div>
        </div>
    );
}

AccountSettings.propTypes = {
    id               : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    login            : PropTypes.string,
    avatar           : PropTypes.string,
    addToast         : PropTypes.func.isRequired,
    openModal        : PropTypes.func.isRequired,
    updateUserAvatar : PropTypes.func.isRequired,
    updatePassword   : PropTypes.func.isRequired,
    t                : PropTypes.func,
    changeLanguage   : PropTypes.func,
    languageId       : PropTypes.string,
    customForms      : PropTypes.array
};

AccountSettings.defaultProps = {
    id             : '',
    login          : '',
    avatar         : '',
    t              : (text) => text,
    changeLanguage : void 0,
    languageId     : void 0,
    customForms    : void 0
};

export default AccountSettings;

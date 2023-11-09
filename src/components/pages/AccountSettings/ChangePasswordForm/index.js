/* eslint-disable  babel/no-unused-expressions */

import React, { useCallback }          from 'react';
import PropTypes                       from 'prop-types';
import { connect }                     from 'react-redux';

import ChangePasswordForm              from 'templater-ui/src/components/pages/AccountSettings/ChangePasswordForm';

import * as toastActions               from 'Actions/toasts';
import * as accountSettingsActions     from 'Actions/accountSettings';

function ChangePasswordFormWrapper({ updateAccountSettings, ...props }) {
    const getConfiguration = useCallback(({ t, styles }) => ({
        name   : 'changePassword',
        fields : [
            {
                name    : 'oldPassword',
                type    : 'password',
                label   : t('Current password'),
                default : ''
            },
            {
                name    : 'newPassword',
                type    : 'passwordStrength',
                label   : t('New password'),
                default : '',
                props   : {
                    t
                }
            },
            {
                name    : 'passwordConfirm',
                type    : 'password',
                label   : t('Confirm password'),
                default : ''
            }
        ],
        controls : {
            submit : {
                title : t('Update'),
                props : {
                    size      : 'L',
                    className : styles.submitButton,
                    color     : 'actionButton'
                }
            }
        }
    }), []);

    const initialState = {
        oldPassword     : '',
        newPassword     : '',
        passwordConfirm : ''
    };

    const handleUpdateAccountSettings = useCallback(async ({ data, onSuccess, onError, onFinally }) =>
        // eslint-disable-next-line more/no-then
        updateAccountSettings(data)
            .then(onSuccess)
            .catch(error => {
                const errors = {};

                error?.errors?.forEach(e => errors[e.field] = e.message);
                onError({ errors });
            })
            .finally(onFinally), []);

    return (<ChangePasswordForm
        {...props}
        initialState          = {initialState}
        getConfiguration      = {getConfiguration}
        updateAccountSettings = {handleUpdateAccountSettings}
        alwaysSubmitOnOnter
    />);
}

ChangePasswordFormWrapper.propTypes = {
    updateAccountSettings : PropTypes.func.isRequired
};

const mapDispatchToProps = {
    ...toastActions,
    ...accountSettingsActions
};

export default connect(null, mapDispatchToProps)(ChangePasswordFormWrapper);

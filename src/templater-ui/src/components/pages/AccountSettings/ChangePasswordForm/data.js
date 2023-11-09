
export const INITIAL_FORM_STATE = {
    old_password    : '',
    password        : '',
    password_retype : ''
};

// eslint-disable-next-line func-style
export const getDefaultConfiguration = ({ t, styles }) => ({
    name   : 'changePassword',
    fields : [
        {
            name    : 'old_password',
            type    : 'password',
            label   : t('Current password'),
            default : ''
        },
        {
            name    : 'password',
            type    : 'passwordStrength',
            label   : t('New password'),
            default : ''
        },
        {
            name    : 'password_retype',
            type    : 'password',
            label   : t('Confirm password'),
            default : '',
            props   : {
                t
            }
        }
    ],
    controls : {
        submit : {
            title : t('Save'),
            props : {
                size      : 'L',
                className : styles.submitButton,
                color     : 'actionButton'
            }
        }
    }
});

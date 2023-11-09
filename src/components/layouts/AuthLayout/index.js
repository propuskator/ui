import { connect }              from 'react-redux';
import { compose }              from 'redux';
import { withTranslation }      from 'react-i18next';


import * as sessionActions      from 'Actions/sessions';
import {
    fetchAccountSettings
}                               from 'Actions/accountSettings';
import {
    fetchNotificationsByInterval
}                               from 'Actions/notifications';

import AuthLayout               from './AuthLayout';


const mapDispatchToProps = {
    ...sessionActions,
    fetchAccountSettings,
    fetchNotificationsByInterval
};

export default compose(
    withTranslation(),
    connect(null, mapDispatchToProps)
)(AuthLayout);


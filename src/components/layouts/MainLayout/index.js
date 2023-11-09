import { connect }              from 'react-redux';
import * as sessionActions      from 'Actions/sessions';

import {
    fetchAccountSettings
}                               from 'Actions/accountSettings';
import {
    fetchNotificationsByInterval
}                               from 'Actions/notifications';
import {
    fetchWorkspaceSettings
}                               from 'Actions/workspace';

import MainLayout               from './MainLayout';


const mapDispatchToProps = {
    ...sessionActions,
    fetchAccountSettings,
    fetchWorkspaceSettings,
    fetchNotificationsByInterval
};

export default connect(null, mapDispatchToProps)(MainLayout);


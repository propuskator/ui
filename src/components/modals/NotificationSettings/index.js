import { connect }                      from 'react-redux';

import * as toastActions                from 'Actions/toasts';
import { updateWorkspaceSettings }      from 'Actions/workspace';
import {
    workspaceNotificationsTypesSelector
}                                       from 'Selectors/workspace';

import withCloseOnEsc                   from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent  from '../withAllowTabMoveOnlyInComponent';

import NotificationSettings      from './NotificationSettings';


function mapStateToProps(state) {
    return {
        workspaceNotifications : workspaceNotificationsTypesSelector(state)
    };
}

const mapDispatchToProps = {
    ...toastActions,
    updateWorkspaceSettings
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(NotificationSettings));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

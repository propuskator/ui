import { connect }                     from 'react-redux';

import {
    fetchNotificationsByInterval,
    fetchNotificationsLazy,
    updateNotificationsIsRead,
    readAllNotifications
} from 'Actions/notifications';
import {
    notificationsListSelector,
    notificationsIsFetchingSelector,
    notificationsLazyParamsSelector
}                                      from 'Selectors/notifications';

import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import Notifications                   from './Notifications';

function mapStateToProps(state) {
    const notificationsList = notificationsListSelector(state) || [];

    return {
        list              : notificationsList,
        amount            : notificationsList?.length,
        itemsToReadAmount : notificationsList.filter(item => !item.isRead).length,
        isFetching        : notificationsIsFetchingSelector(state),
        lazyParams        : notificationsLazyParamsSelector(state)
    };
}

const mapDispatchToProps = {
    fetchNotificationsLazy,
    fetchNotificationsByInterval,
    updateNotificationsIsRead,
    readAllNotifications
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(Notifications));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

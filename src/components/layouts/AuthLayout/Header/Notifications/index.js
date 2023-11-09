import { connect }                     from 'react-redux';

import {
    notificationsLazyParamsSelector
}                                      from 'Selectors/notifications';

import Notifications                   from './Notifications';

function mapStateToProps(state) {
    return {
        counter : notificationsLazyParamsSelector(state)?.unreadTotal
    };
}

export default connect(mapStateToProps)(Notifications);

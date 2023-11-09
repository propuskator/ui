export const notificationsListSelector           = state => state.notifications.list;
export const notificationsCountSelector          = state => state.notifications.list.length;
export const notificationsFiltersSelector        = state => state.notifications.filters;
export const notificationsIsFetchingSelector     = state => state.notifications.isFetching;
export const notificationsFetchTimestampSelector = state => state.notifications.fetchTimestamp;
export const notificationsLazyParamsSelector     = state => state.notifications.lazyParams;

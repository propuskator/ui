import api               from 'ApiSingleton';
import {
    // notificationsListSelector,
    notificationsFiltersSelector,
    notificationsFetchTimestampSelector,
    notificationsCountSelector
}                         from 'Selectors/notifications';

export const FETCH_NOTIFICATIONS_REQUEST      = 'FETCH_NOTIFICATIONS_REQUEST';
export const FETCH_NOTIFICATIONS_SUCCESS      = 'FETCH_NOTIFICATIONS_SUCCESS';
export const FETCH_NOTIFICATIONS_PART_SUCCESS = 'FETCH_NOTIFICATIONS_PART_SUCCESS';
export const FETCH_NOTIFICATIONS_END          = 'FETCH_NOTIFICATIONS_END';
export const FETCH_NOTIFICATIONS_ERROR        = 'FETCH_NOTIFICATIONS_ERROR';
export const UPDATE_NOTIFICATIONS             = 'UPDATE_NOTIFICATIONS';

export const FETCH_NOTIFICATIONS_LAZY_REQUEST = 'FETCH_NOTIFICATIONS_LAZY_REQUEST';
export const FETCH_NOTIFICATIONS_LAZY_SUCCESS = 'FETCH_NOTIFICATIONS_LAZY_SUCCESS';
export const FETCH_NOTIFICATIONS_LAZY_END     = 'FETCH_NOTIFICATIONS_LAZY_END';

function dumpNotification(data) {
    return data;
}

let fetchTimeout = null;
let isRepeatFetch = false;

export function stopNotificationsFetching() {
    return async (dispatch) => {
        clearTimeout(fetchTimeout);

        fetchTimeout = null;
        isRepeatFetch = false;

        dispatch({ type: FETCH_NOTIFICATIONS_REQUEST, payload: { timestamp: +new Date() } });
    };
}

export function fetchNotificationsByInterval() {
    if (fetchTimeout) clearInterval(fetchTimeout);

    return dispatch => {
        isRepeatFetch = true;

        dispatch(fetchNotifications());
    };
}

export function getMaxDateInList(list, key = 'updatedAt') {
    if (!list?.length) return void 0;
    let max = '';

    list.forEach((listItem = {}) => {
        const currDate = listItem[key];

        if (currDate) {
            const currentDate = new Date(currDate);
            const maxDate = new Date(max);

            if (max && currentDate.valueOf() > maxDate.valueOf()) {
                max = currDate;
            } else if (!max) {
                max = currDate;
            }
        }
    });

    return max;
}

export function fetchNotificationsList(filters) {
    return async () => {
        const { data, meta } = await api.notifications.list(filters);

        return { data, meta };
    };
}

export function fetchNotificationsLazy({ isSetUpdateStart = false } = {}) {
    return async (dispatch, getState) => {
        const isContinueRepeatFetch = isRepeatFetch;

        dispatch(stopNotificationsFetching());
        dispatch({ type: FETCH_NOTIFICATIONS_LAZY_REQUEST });

        try {
            const state = getState();

            const LIMIT_NOTIFICATIONS = 50;
            const notificationCount = notificationsCountSelector(state);

            const { data, meta } = await dispatch(fetchNotificationsList({
                offset : notificationCount,
                limit  : LIMIT_NOTIFICATIONS
            }));

            const updatedFilters = {};

            if (isSetUpdateStart) {
                const maxUpdatedAt = getMaxDateInList(data);

                updatedFilters.updateStart = maxUpdatedAt
                    ? new Date(+new Date(maxUpdatedAt) + 1).toISOString()
                    : new Date().toISOString();
            }

            dispatch({
                type    : FETCH_NOTIFICATIONS_LAZY_SUCCESS,
                payload : {
                    data,
                    filters    : updatedFilters,
                    lazyParams : {
                        total       : meta.total,
                        unreadTotal : meta.unreadTotal
                    }
                }
            });

            return { data, meta };
        } catch (e) {
            console.error('action fetchNotificationsLazy');
        } finally {
            dispatch({ type: FETCH_NOTIFICATIONS_LAZY_END });
            if (isContinueRepeatFetch) dispatch(fetchNotificationsByInterval());
        }
    };
}

export function fetchNotifications() {
    return async (dispatch, getState) => {
        const timestamp = +new Date();

        dispatch({ type: FETCH_NOTIFICATIONS_REQUEST, payload: { timestamp } });

        try {
            const state   = getState();
            const filters = notificationsFiltersSelector(state) || {};

            if (!filters.updateStart) {
                dispatch(fetchNotificationsLazy({ isSetUpdateStart: true }));

                 return;
            }

            const { data, meta } = await dispatch(fetchNotificationsList({ ...filters }));

            const fetchTimestamp = notificationsFetchTimestampSelector(state);

            if (fetchTimestamp !== timestamp) return;

            const maxUpdatedAt = getMaxDateInList(data);

            const updatedFilters = {
                ...filters,
                updateStart : maxUpdatedAt
                    ? new Date(+new Date(maxUpdatedAt) + 1).toISOString()
                    : filters.updateStart
            };

            if (filters?.updateStart && !data?.length) {
                return dispatch({
                    type    : FETCH_NOTIFICATIONS_END,
                    payload : {
                        filters    : updatedFilters,
                        lazyParams : {
                            total       : meta.total,
                            unreadTotal : meta.unreadTotal
                        }
                    }
                });
            }

            dispatch({
                type    : FETCH_NOTIFICATIONS_PART_SUCCESS,
                payload : {
                    data       : data.map(dumpNotification),
                    filters    : updatedFilters,
                    lazyParams : {
                        total       : meta.total,
                        unreadTotal : meta.unreadTotal
                    }
                }
            });

            return data;
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_NOTIFICATIONS_ERROR });
        } finally {
            if (isRepeatFetch) {
                const twoSeconds = 2e3;

                fetchTimeout = setTimeout(() => {
                    dispatch(fetchNotifications());
                }, twoSeconds);
            }
        }
    };
}

export function readAllNotifications() {
    return async (dispatch) => {
        try {
            dispatch(stopNotificationsFetching());

            await api.notifications.readAll();

            // const notifications = notificationsListSelector(getState());
            //
            // const updatedNotifications = notifications?.map(item => ({ ...item, isRead: true }));
            //
            // dispatch({
            //     type    : UPDATE_NOTIFICATIONS,
            //     payload : {
            //         data : updatedNotifications
            //     }
            // });
        } catch (e) {
            console.error(e);
        } finally {
            dispatch(fetchNotificationsByInterval());
        }
    };
}

export function updateNotificationsIsRead({ list, isRead } = {}) {
    return async (dispatch) => {
        try {
            dispatch(stopNotificationsFetching());

            // const notificationsList = notificationsListSelector(getState());
            // const notificationsToSet = notificationsList.map(item => {
            //     if (!list.includes(item.id)) return item;
            //
            //     return ({
            //         ...item,
            //         isRead
            //     });
            // });
            //
            // dispatch({
            //     type    : UPDATE_NOTIFICATIONS,
            //     payload : {
            //         data : notificationsToSet
            //     }
            // });

            const requestData = {
                ids : list
            };

            if (isRead) {
                await api.notifications.deactivate(requestData);
            } else {
                await api.notifications.activate(requestData);
            }
            dispatch(fetchNotificationsByInterval(true));
        } catch (error) {
            console.error(error);
            // dispatch({ type: FETCH_ACCESS_SUBJECTS_ERROR });
        }
    };
}

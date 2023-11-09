/* eslint-disable no-case-declarations */
import { combineReducers } from 'redux';
import {
    FETCH_NOTIFICATIONS_REQUEST,
    FETCH_NOTIFICATIONS_SUCCESS,
    FETCH_NOTIFICATIONS_PART_SUCCESS,
    FETCH_NOTIFICATIONS_END,
    FETCH_NOTIFICATIONS_ERROR,
    UPDATE_NOTIFICATIONS,
    FETCH_NOTIFICATIONS_LAZY_SUCCESS,
    FETCH_NOTIFICATIONS_LAZY_REQUEST,
    FETCH_NOTIFICATIONS_LAZY_END
} from 'Actions/notifications';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

const initialState = {
    list           : [],
    isFetching     : true,
    fetchTimestamp : null,
    filters        : {},
    lazyParams     : {
        total         : 0,
        unreadTotal   : 0,
        isLazyLoading : false
    }
};

function list(state = initialState.list, action = {}) {
    const { payload } = action;

    switch (action.type) {
        case FETCH_NOTIFICATIONS_LAZY_SUCCESS:
            return [ ...state, ...payload.data ];
        case FETCH_NOTIFICATIONS_SUCCESS:
        case UPDATE_NOTIFICATIONS:
            return payload.data;
        case FETCH_NOTIFICATIONS_PART_SUCCESS:
            const updatedList = payload?.data || [];

            const oldItems = [ ...(state || []) ]?.map(listItem => {
                const updated = updatedList?.find(item => item?.id === listItem?.id);

                return updated ? updated : listItem;
            });

            const newItems = updatedList?.filter(listItem => !oldItems?.find(item => item?.id === listItem?.id));

            const [ read, unread ] = [ ...newItems, ...oldItems ].reduce(([ readed, unreaded ], elem) => {
                return elem.isRead ? [ [ ...readed, elem ], unreaded ] : [ readed, [ ...unreaded, elem ] ];
            }, [ [], [] ]);

            const sortedUnreadNotifications = unread.sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt));
            const sortedReadNotifications = read.sort((a, b) =>  new Date(b.createdAt) - new Date(a.createdAt));

            return [ ...sortedUnreadNotifications, ...sortedReadNotifications ];
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.list;
        default:
            return state;
    }
}

function fetchTimestamp(state = initialState.fetchTimestamp, action = {}) {
    switch (action.type) {
        case FETCH_NOTIFICATIONS_REQUEST:
            return action.payload.timestamp;
        case LOGOUT:
        case LOGIN_ERROR:
            return '';
        default:
            return state;
    }
}

function filters(state = initialState.filters, action = {}) {
    switch (action.type) {
        // case UPDATE_FILTER_SUCCESS:
        //     return {
        //         ...state,
        //         ...action.payload
        //     };
        case FETCH_NOTIFICATIONS_LAZY_SUCCESS:
        case FETCH_NOTIFICATIONS_SUCCESS:
        case FETCH_NOTIFICATIONS_END:
        case FETCH_NOTIFICATIONS_PART_SUCCESS:
            return {
                ...state,
                ...(action?.payload?.filters || {})
            };
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.filters;
        default:
            return state;
    }
}

function isFetching(state = initialState.isFetching, action = {}) {
    switch (action.type) {
        case FETCH_NOTIFICATIONS_REQUEST:
            return true;
        case FETCH_NOTIFICATIONS_SUCCESS:
        case FETCH_NOTIFICATIONS_ERROR:
        case FETCH_NOTIFICATIONS_END:
            return false;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.isFetching;
        default:
            return state;
    }
}

function lazyParams(state = initialState.lazyParams, action = {}) {
    switch (action.type) {
        case FETCH_NOTIFICATIONS_LAZY_REQUEST:
            return {
                ...state,
                isLazyLoading : true
            };
        case FETCH_NOTIFICATIONS_LAZY_END:
            return {
                ...state,
                isLazyLoading : false
            };
        case FETCH_NOTIFICATIONS_LAZY_SUCCESS:
        case FETCH_NOTIFICATIONS_END:
        case FETCH_NOTIFICATIONS_PART_SUCCESS:
            return {
                ...state,
                ...(action?.payload?.lazyParams || {})
            };
        default:
            return state;
    }
}

export default combineReducers({
    list,
    isFetching,
    filters,
    fetchTimestamp,
    lazyParams
});

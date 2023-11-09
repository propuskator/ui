import { combineReducers } from 'redux';
import {
    FETCH_ACCESS_READERS_GROUPS_REQUEST,
    FETCH_ACCESS_READERS_GROUPS_SUCCESS,
    FETCH_ACCESS_READERS_GROUPS_ERROR,
    UPDATE_ACCESS_READERS_GROUP_SUCCESS,
    CLEAR_ACCESS_READERS_GROUPS,
    UPDATE_ACCESS_READERS_GROUPS_FILTER
} from 'Actions/accessReadersGroups';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';


const initialState = {
    list       : [],
    isFetching : true,
    amount     : 0,
    total      : 0,
    filters    : {
        offset     : 0,
        limit      : 10,
        isArchived : false,
        search     : '',
        sortedBy   : 'createdAt',
        order      : 'DESC'
    }
};

function list(state = initialState.list, action = {}) {
    const { payload } = action;

    switch (action.type) {
        case FETCH_ACCESS_READERS_GROUPS_SUCCESS:
            return payload.data;
        case UPDATE_ACCESS_READERS_GROUP_SUCCESS:
            return state.map(item => {
                return item.id === payload.id ? payload.entity : item;
            });
        case CLEAR_ACCESS_READERS_GROUPS:
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.list;
        default:
            return state;
    }
}

function isFetching(state = initialState.isFetching, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_READERS_GROUPS_REQUEST:
            return true;
        case FETCH_ACCESS_READERS_GROUPS_SUCCESS:
        case FETCH_ACCESS_READERS_GROUPS_ERROR:
            return false;
        case CLEAR_ACCESS_READERS_GROUPS:
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.isFetching;
        default:
            return state;
    }
}

function filters(state = initialState.filters, action = {}) {
    const { type, payload = {} } = action;

    switch (type) {
        case UPDATE_ACCESS_READERS_GROUPS_FILTER:
            return {
                ...state,
                ...payload.filters
            };
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.filters;
        default:
            return state;
    }
}

function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_READERS_GROUPS_SUCCESS:
            return action.payload.meta?.filteredCount;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.amount;
        default:
            return state;
    }
}

function total(state = initialState.total, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_READERS_GROUPS_SUCCESS:
            return action.payload.meta?.total || 0;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.total;
        default:
            return state;
    }
}

export default combineReducers({
    list,
    amount,
    total,
    isFetching,
    filters
});

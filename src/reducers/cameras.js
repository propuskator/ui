import { combineReducers } from 'redux';
import {
    FETCH_CAMERAS_REQUEST,
    FETCH_CAMERAS_SUCCESS,
    FETCH_CAMERAS_ERROR,
    UPDATE_FILTER_SUCCESS,
    UPDATE_CAMERAS_COLUMNS
} from 'Actions/cameras';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

const initialState = {
    list           : [],
    visibleColumns : [ 'updatedAt', 'createdAt' ],
    isFetching     : true,
    amount         : 0,
    total          : 0,
    filters        : {
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
        case FETCH_CAMERAS_SUCCESS:
            return payload.data;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.list;
        default:
            return state;
    }
}

function total(state = initialState.total, action = {}) {
    switch (action.type) {
        case FETCH_CAMERAS_SUCCESS:
            return action.payload.meta?.total || 0;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.total;
        default:
            return state;
    }
}

function visibleColumns(state = initialState.visibleColumns, action = {}) {
    const { payload, type } = action;

    switch (type) {
        case UPDATE_CAMERAS_COLUMNS:
            return payload?.visibleColumns;
        default:
            return state;
    }
}

function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_CAMERAS_SUCCESS:
            return action.payload.meta?.filteredCount || 0;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.amount;
        default:
            return state;
    }
}


function filters(state = initialState.filters, action = {}) {
    switch (action.type) {
        case UPDATE_FILTER_SUCCESS:
            return {
                ...state,
                ...action.payload
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
        case FETCH_CAMERAS_REQUEST:
            return true;
        case FETCH_CAMERAS_SUCCESS:
        case FETCH_CAMERAS_ERROR:
            return false;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.isFetching;
        default:
            return state;
    }
}

export default combineReducers({
    list,
    visibleColumns,
    isFetching,
    amount,
    total,
    filters
});

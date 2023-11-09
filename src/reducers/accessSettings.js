import { combineReducers } from 'redux';
import {
    FETCH_ACCESS_SETTINGS_REQUEST,
    FETCH_ACCESS_SETTINGS_ERROR,
    FETCH_ACCESS_SETTINGS_SUCCESS,
    // UPDATE_ACCESS_SETTING_SUCCESS,
    UPDATE_ACCESS_SETTINGS_FILTER,
    UPDATE_ACCESS_SETTINGS_COLUMNS
} from 'Actions/accessSettings';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

const initialState = {
    list           : [],
    visibleColumns : [ 'updatedAt', 'createdAt' ],
    isFetching     : false,
    amount         : 0,
    total          : 0,
    filters        : {
        offset                : 0,
        limit                 : 10,
        isArchived            : false,
        accessReadersGroupIds : [],
        accessScheduleIds     : [],
        search                : '',
        sortedBy              : 'createdAt',
        order                 : 'DESC'
    }
};

function list(state = initialState.list, action = {}) {
    const { payload } = action;

    switch (action.type) {
        case FETCH_ACCESS_SETTINGS_SUCCESS:
            return payload.data;
        // case UPDATE_ACCESS_SETTING_SUCCESS:
        //     return state.map(accessSetting => accessSetting.id === payload.id
        //         ? payload?.accessSetting.id
        //         : accessSetting);
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.list;
        default:
            return state;
    }
}

function visibleColumns(state = initialState.visibleColumns, action = {}) {
    const { payload, type } = action;

    switch (type) {
        case UPDATE_ACCESS_SETTINGS_COLUMNS:
            return payload?.visibleColumns;
        default:
            return state;
    }
}

function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_SETTINGS_SUCCESS:
            return action.payload?.meta?.filteredCount;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.amount;
        default:
            return state;
    }
}

function total(state = initialState.total, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_SETTINGS_SUCCESS:
            return action.payload?.meta?.total || 0;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.total;
        default:
            return state;
    }
}

function filters(state = initialState.filters, action = {}) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_ACCESS_SETTINGS_FILTER:
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

function isFetching(state = initialState.isFetching, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_SETTINGS_REQUEST:
            return true;
        case FETCH_ACCESS_SETTINGS_SUCCESS:
        case FETCH_ACCESS_SETTINGS_ERROR:
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

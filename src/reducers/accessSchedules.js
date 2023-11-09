import { combineReducers } from 'redux';
import {
    FETCH_ACCESS_SCHEDULES_REQUEST,
    FETCH_ACCESS_SCHEDULES_SUCCESS,
    FETCH_ACCESS_SCHEDULES_ERROR,
    // UPDATE_ACCESS_SCHEDULE_SUCCESS,
    UPDATE_FILTER_SUCCESS,
    UPDATE_ACCESS_SCHEDULE_COLUMNS
} from 'Actions/accessSchedules';

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
        case FETCH_ACCESS_SCHEDULES_SUCCESS:
            return payload.data;
        // case UPDATE_ACCESS_SCHEDULE_SUCCESS:
        //     return state.map(entity => entity.id === payload.id ? payload.accessSchedule : entity);
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
        case UPDATE_ACCESS_SCHEDULE_COLUMNS:
            return payload?.visibleColumns;
        default:
            return state;
    }
}

function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_SCHEDULES_SUCCESS:
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
        case FETCH_ACCESS_SCHEDULES_SUCCESS:
            return action.payload.meta?.total || 0;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.total;
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
        case FETCH_ACCESS_SCHEDULES_REQUEST:
            return true;
        case FETCH_ACCESS_SCHEDULES_SUCCESS:
        case FETCH_ACCESS_SCHEDULES_ERROR:
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

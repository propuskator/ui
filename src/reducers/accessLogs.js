import { combineReducers } from 'redux';
import {
    FETCH_ACCESS_LOGS_REQUEST,
    FETCH_ACCESS_LOGS_SUCCESS,
    FETCH_ACCESS_LOGS_ERROR,
    UPDATE_ACCESS_LOGS_FILTER,
    START_LOADING_ACCESS_LOGS_CSV,
    END_LOADING_ACCESS_LOGS_CSV
} from 'Actions/accessLogs';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

const initialState = {
    list         : [],
    isFetching   : false,
    amount       : 0,
    total        : 0,
    isLoadingCsv : false,
    filters      : {
        offset               : 0,
        limit                : 10,
        status               : '',
        search               : '',
        sortedBy             : 'attemptedAt',
        order                : 'DESC',
        accessTokenReaderIds : [],
        initiatorTypes       : [],
        accessSubjectTokenId : '',
        accessSubjectId      : ''
    }
};

function list(state = initialState.list, action = {}) {
    const { payload } = action;

    switch (action.type) {
        case FETCH_ACCESS_LOGS_SUCCESS:
            return payload.data;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.list;
        default:
            return state;
    }
}

function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_LOGS_SUCCESS:
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
        case FETCH_ACCESS_LOGS_SUCCESS:
            return action.payload?.meta?.total || 0;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.total;
        default:
            return state;
    }
}

function filters(state = initialState?.filters, action = {}) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_ACCESS_LOGS_FILTER:
            return {
                ...state,
                ...payload?.filters
            };
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState?.filters || {};
        default:
            return state;
    }
}

function isFetching(state = initialState.isFetching, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_LOGS_REQUEST:
            return true;
        case FETCH_ACCESS_LOGS_SUCCESS:
        case FETCH_ACCESS_LOGS_ERROR:
            return false;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.isFetching;
        default:
            return state;
    }
}

function isLoadingCsv(state = initialState.isLoadingCsv, action = {}) {
    switch (action.type) {
        case START_LOADING_ACCESS_LOGS_CSV:
            return true;
        case END_LOADING_ACCESS_LOGS_CSV:
            return false;
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState.isLoadingCsv;
        default:
            return state;
    }
}

export default combineReducers({
    list,
    isFetching,
    amount,
    total,
    filters,
    isLoadingCsv
});

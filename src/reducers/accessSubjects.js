import { combineReducers } from 'redux';
import {
    FETCH_ACCESS_SUBJECTS_REQUEST,
    FETCH_ACCESS_SUBJECTS_SUCCESS,
    FETCH_ACCESS_SUBJECTS_ERROR,
    // UPDATE_ACCESS_SUBJECT_SUCCESS,
    UPDATE_ACCESS_SUBJECTS_FILTER,
    START_LOADING_SUBJECTS_CSV,
    END_LOADING_SUBJECTS_CSV,
    UPDATE_ACCESS_SUBJECTS_COLUMNS
} from 'Actions/accessSubjects';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

const initialState = {
    list           : [],
    visibleColumns : [ 'updatedAt', 'createdAt' ],
    isFetching     : false,
    isLoadingCsv   : false,
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
    const { payload = {} } = action;

    switch (action.type) {
        case FETCH_ACCESS_SUBJECTS_SUCCESS:
            return payload.data;
        // case UPDATE_ACCESS_SUBJECT_SUCCESS:
        //     return state.map(accessSubject =>
        //         accessSubject.id === payload.accessSubject?.id ? payload.accessSubject : accessSubject);
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
        case UPDATE_ACCESS_SUBJECTS_COLUMNS:
            return payload?.visibleColumns;
        default:
            return state;
    }
}

function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_SUBJECTS_SUCCESS:
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
        case FETCH_ACCESS_SUBJECTS_SUCCESS:
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
        case UPDATE_ACCESS_SUBJECTS_FILTER:
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
        case FETCH_ACCESS_SUBJECTS_REQUEST:
            return true;
        case FETCH_ACCESS_SUBJECTS_SUCCESS:
        case FETCH_ACCESS_SUBJECTS_ERROR:
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
        case START_LOADING_SUBJECTS_CSV:
            return true;
        case END_LOADING_SUBJECTS_CSV:
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
    visibleColumns,
    isFetching,
    amount,
    total,
    filters,
    isLoadingCsv
});

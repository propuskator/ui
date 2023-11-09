import { combineReducers } from 'redux';
import {
    FETCH_ACCESS_TOKEN_READERS_REQUEST,
    FETCH_ACCESS_TOKEN_READERS_SUCCESS,
    FETCH_ACCESS_TOKEN_READERS_ERROR,
    // UPDATE_ACCESS_TOKEN_READER_SUCCESS,
    UPDATE_ACCESS_TOKEN_READERS_FILTER,
    UPDATE_ACCESS_TOKEN_READERS_COLUMNS,
    UPDATE_ACCESS_READER_DISPLAYED_TOKENS_SUCCESS
} from 'Actions/accessTokenReaders';

import {
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

const initialState = {
    list           : [],
    visibleColumns : [ 'code', 'readersGroups', 'updatedAt', 'createdAt' ],
    isFetching     : false,
    amount         : 0,
    total          : 0,
    filters        : {
        offset                : 0,
        limit                 : 10,
        isArchived            : false,
        accessReadersGroupIds : [],
        search                : '',
        sortedBy              : 'createdAt',
        order                 : 'DESC'
    }
};

function list(state = initialState.list, action = {}) {
    const { payload } = action;

    switch (action.type) {
        case FETCH_ACCESS_TOKEN_READERS_SUCCESS:
            return payload.data;
        case UPDATE_ACCESS_READER_DISPLAYED_TOKENS_SUCCESS:
            return state.map(reader => reader.id === payload.accessTokenReaderId
                ? { ...reader, displayedTopics: payload.displayedTopics }
                : reader);
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
        case UPDATE_ACCESS_TOKEN_READERS_COLUMNS:
            return payload?.visibleColumns;
        default:
            return state;
    }
}
function amount(state = initialState.amount, action = {}) {
    switch (action.type) {
        case FETCH_ACCESS_TOKEN_READERS_SUCCESS:
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
        case FETCH_ACCESS_TOKEN_READERS_SUCCESS:
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
        case UPDATE_ACCESS_TOKEN_READERS_FILTER:
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
        case FETCH_ACCESS_TOKEN_READERS_REQUEST:
            return true;
        case FETCH_ACCESS_TOKEN_READERS_SUCCESS:
        case FETCH_ACCESS_TOKEN_READERS_ERROR:
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
    isFetching,
    amount,
    total,
    visibleColumns,
    filters
});

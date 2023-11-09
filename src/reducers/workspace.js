import {
    FETCH_WORKSPACE_SETTINGS_SUCCESS,
    FETCH_WORKSPACE_SETTINGS_ERROR,
    UPDATE_WORKSPACE_SETTINGS_SUCCESS,
    UPDATE_WORKSPACE_SETTINGS_ERROR,
    FETCH_WORKSPACE_SETTINGS_REQUEST,
    UPDATE_WORKSPACE_SETTINGS_REQUEST
} from 'Actions/workspace';

const initialState = {
    notificationTypes : [],
    timezone          : '',
    isFetching        : false,
    isError           : false
};

export default function workspace(state = initialState, action = {}) {
    const { type, payload = {} } = action;

    switch (type) {
        case FETCH_WORKSPACE_SETTINGS_REQUEST:
        case UPDATE_WORKSPACE_SETTINGS_REQUEST:
            return {
                ...state,
                isFetching : true
            };
        case FETCH_WORKSPACE_SETTINGS_SUCCESS:
        case UPDATE_WORKSPACE_SETTINGS_SUCCESS:
            return {
                ...state,
                isFetching        : false,
                notificationTypes : payload?.notificationTypes,
                timezone          : payload?.timezone
            };
        case FETCH_WORKSPACE_SETTINGS_ERROR:
        case UPDATE_WORKSPACE_SETTINGS_ERROR:
            return { ...state, isFetching: false, isError: true };
        default:
            return state;
    }
}

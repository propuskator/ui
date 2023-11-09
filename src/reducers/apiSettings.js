import {
    FETCH_API_SETTINGS_REQUEST,
    FETCH_API_SETTINGS_SUCCESS,
    FETCH_API_SETTINGS_ERROR,
    REFRESH_API_SETTINGS_REQUEST,
    REFRESH_API_SETTINGS_SUCCESS,
    REFRESH_API_SETTINGS_ERROR
} from 'Actions/apiSettings';
import {
    LOGOUT
} from 'Actions/sessions';

const initialState = {
    data : {
        url         : '',
        token       : '',
        emqxTcpPort : '',
        cert        : ''
    },
    isFetching : true
};

export default function apiSettings(state = initialState, action = {}) {
    const { type, payload = {} } = action;

    switch (type) {
        case FETCH_API_SETTINGS_REQUEST:
        case REFRESH_API_SETTINGS_REQUEST:
            return {
                ...state,
                isFetching : true
            };
        case FETCH_API_SETTINGS_SUCCESS:
        case REFRESH_API_SETTINGS_SUCCESS:
            return {
                ...state,
                data : {
                    ...state.data,
                    ...(payload.data)
                },
                isFetching : false
            };
        case FETCH_API_SETTINGS_ERROR:
        case REFRESH_API_SETTINGS_ERROR:
            return {
                ...state,
                isFetching : false
            };
        case LOGOUT:
            return { ...initialState };
        default:
            return state;
    }
}

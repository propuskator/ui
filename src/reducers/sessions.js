import {
    LOGIN,
    LOGOUT,
    LOGIN_ERROR
} from 'Actions/sessions';

import {
    FETCH_ACCOUNT_SETTINGS_SUCCESS
} from 'Actions/accountSettings';

const initialState = {
    isUserLoggedIn : false,
    error          : {
        type    : '',
        message : '',
        errors  : []
    }
};

export default function sessions(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN:
        case FETCH_ACCOUNT_SETTINGS_SUCCESS:
            return { ...state, isUserLoggedIn: true, error: initialState.error };
        case LOGOUT:
            return { ...initialState, isUserLoggedIn: false, error: initialState.error };
        case LOGIN_ERROR:
            return { ...initialState, error: action.payload };
        // case UPDATE_ACCOUNT_SETTINGS_SUCCESS:
        //     return { ...state, userData: action.payload };
        default:
            return state;
    }
}

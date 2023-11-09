import {
    LOGOUT,
    LOGIN,
    SESSION_CKECKED,
    FIRST_LOGIN
} from './../constants/actions/sessions';
import {
    FETCH_ACCOUNT_SETTINGS_SUCCESS
} from './../constants/actions/accountSettings';

const initialState = {
    isUserLoggedIn   : false,
    isSessionChecked : false,
    isFirstLogin     : false
};

export default function sessions(state = initialState, action = {}) {
    const { type } = action;

    switch (type) {
        case LOGIN:
        case FETCH_ACCOUNT_SETTINGS_SUCCESS:
            return { ...state, isUserLoggedIn: true, isSessionChecked: true };
        case FIRST_LOGIN:
            return { ...state, isFirstLogin: true };
        case LOGOUT:
            return { ...initialState, isSessionChecked: true };
        case SESSION_CKECKED:
            return { ...state, isSessionChecked: true };
        default:
            return state;
    }
}

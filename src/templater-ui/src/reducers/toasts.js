import {
    ADD_TOAST,
    REMOVE_TOAST,
    REMOVE_TOAST_BY_KEY
} from './../constants/actions/toasts';
import {
    LOGOUT
} from './../constants/actions/sessions';

const defaultState = [];

export default function toasts(state = defaultState, action = {}) {
    switch (action.type) {
        case ADD_TOAST:
            return [ action.toast, ...state ];
        case REMOVE_TOAST:
            return state.filter(toast => toast.id !== action.id);
        case REMOVE_TOAST_BY_KEY:
            return state.filter(toast => toast.key !== action.key);
        case LOGOUT:
            return  state.filter(toast => toast.showOnSessionDestroy);
        default:
            return state;
    }
}

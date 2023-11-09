import {
    OPEN_MODAL,
    CLOSE_MODAL,
    CLOSE_ALL_MODALS
} from './../constants/actions/view';
import {
    LOGIN_ERROR,
    LOGOUT
} from './../constants/actions/sessions';

const initialState = {
    modals : [ ]
};

export default function view(state = initialState, action = {}) {
    const { type, payload = {} } = action;
    const { name = '', props = {} } = payload;

    switch (type) {
        case OPEN_MODAL:
            return {
                ...state,
                modals : [
                    ...state.modals,
                    { createdAt: new Date(), name, props: { ...props } }
                ]
            };
        case CLOSE_MODAL:
            return {
                ...state,
                modals : payload.modals
            };
        case CLOSE_ALL_MODALS:
            return {
                ...state,
                modals : []
            };
        case LOGOUT:
        case LOGIN_ERROR:
            return initialState;
        default:
            return state;
    }
}

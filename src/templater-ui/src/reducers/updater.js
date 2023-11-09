import {
    FETCH_CHANGELOG_REQUEST,
    FETCH_CHANGELOG_SUCCESS,
    FETCH_CHANGELOG_ERROR
} from './../constants/actions/updater';

const initialState = {
    version    : '',
    updated_at : '',
    changelogs : null,
    isFetching : false
};

export default function updater(state = initialState, action = {}) {
    const { type, payload = {} } = action;

    switch (type) {
        case FETCH_CHANGELOG_REQUEST:
            return { ...state, isFetching: true };
        case FETCH_CHANGELOG_SUCCESS:
            return {
                ...state,
                isFetching : false,
                version    : payload?.version,
                updated_at : payload?.updated_at,
                changelogs : payload?.changelogs
            };
        case FETCH_CHANGELOG_ERROR:
            return { ...state, isFetching: false };
        default:
            return state;
    }
}

import * as actions             from '../constants/actions/updater';
import { SUCCESS_PAYLOAD_MOCK } from '../__mocks__/updaterMock';
import reducer                  from './updater';

describe('updater reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            version    : '',
            updated_at : '',
            changelogs : null,
            isFetching : false
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('FETCH_CHANGELOG_REQUEST', () => {
        const action = { type: actions.FETCH_CHANGELOG_REQUEST };
        const state = reducer(initialState, action);

        const expected = {
            ...initialState,
            isFetching : true
        };

        expect(state).toEqual(expected);
    });

    it('FETCH_CHANGELOG_SUCCESS', () => {
        const action = {
            type    : actions.FETCH_CHANGELOG_SUCCESS,
            payload : SUCCESS_PAYLOAD_MOCK
        };
        const state = reducer({
            ...initialState,
            isFetching : true
        }, action);

        const expected = {
            ...initialState,
            ...SUCCESS_PAYLOAD_MOCK
        };

        expect(state).toEqual(expected);
    });

    it('FETCH_CHANGELOG_ERROR', () => {
        const action = { type: actions.FETCH_CHANGELOG_ERROR };

        const state = reducer({
            ...initialState,
            ...SUCCESS_PAYLOAD_MOCK,
            isFetching : true
        }, action);

        const expected = {
            ...initialState,
            ...SUCCESS_PAYLOAD_MOCK,
            isFetching : false
        };

        expect(state).toEqual(expected);
    });
});

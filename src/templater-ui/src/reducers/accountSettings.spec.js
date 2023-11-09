import * as actions              from '../constants/actions/accountSettings';
import * as sessionActions       from '../constants/actions/sessions';

import { AUTH_RESP_MOCK }        from '../__mocks__/sessionsMock';
import { ACCOUNT_SETTINGS_MOCK } from '../__mocks__/accountSettingsMock';

import reducer                   from './accountSettings';

describe('accountSettings reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            id         : '',
            avatar_url : '',
            login      : '',
            isFetching : false,
            isError    : false
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });


    it('LOGIN', () => {
        const action = { type: sessionActions.LOGIN, payload: AUTH_RESP_MOCK };
        const state = reducer(initialState, action);

        const expected = {
            ...initialState,
            id         : AUTH_RESP_MOCK.id,
            avatar_url : AUTH_RESP_MOCK.avatar_url,
            login      : AUTH_RESP_MOCK.login
        };

        expect(state).toEqual(expected);
    });

    it('UPDATE_ACCOUNT_SETTINGS_SUCCESS', () => {
        const action = {
            type    : actions.UPDATE_ACCOUNT_SETTINGS_SUCCESS,
            payload : {
                accountSettings : ACCOUNT_SETTINGS_MOCK
            }
        };
        const state = reducer(initialState, action);

        const expected = {
            ...initialState,
            ...ACCOUNT_SETTINGS_MOCK
        };

        expect(state).toEqual(expected);
    });

    it('FETCH_ACCOUNT_SETTINGS_REQUEST', () => {
        const action = { type: actions.FETCH_ACCOUNT_SETTINGS_REQUEST };

        const state = reducer(initialState, action);

        expect(state.isFetching).toBeTruthy();
    });

    it('FETCH_ACCOUNT_SETTINGS_SUCCESS', () => {
        const action = { type: actions.FETCH_ACCOUNT_SETTINGS_SUCCESS, payload: ACCOUNT_SETTINGS_MOCK };

        const state = reducer(initialState, action);

        const expected = {
            ...initialState,
            ...ACCOUNT_SETTINGS_MOCK
        };

        expect(state).toEqual(expected);
    });

    it('FETCH_ACCOUNT_SETTINGS_ERROR', () => {
        initialState.isFetching = true;

        const action = { type: actions.FETCH_ACCOUNT_SETTINGS_ERROR };

        const state = reducer(initialState, action);

        expect(state.isFetching).toBeFalsy();
        expect(state.isError).toBeTruthy();
    });

    it('LOGOUT', () => {
        const action = { type: sessionActions.LOGOUT };

        const state = reducer({ ...initialState, id: 'test id', isFetching: true }, action);

        expect(state).toEqual(initialState);
    });
});

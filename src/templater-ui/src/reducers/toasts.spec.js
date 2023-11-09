import * as actions         from '../constants/actions/toasts';
import * as sessionsActions from '../constants/actions/sessions';
import { TOAST_ERROR_MOCK } from '../__mocks__/toastsMock';
import reducer              from './toasts';

describe('toasts reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = [];
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('ADD_TOAST should add first toast', () => {
        const action = { type: actions.ADD_TOAST, toast: TOAST_ERROR_MOCK };
        const state  = reducer(initialState, action);

        const expected = [ TOAST_ERROR_MOCK ];

        expect(state).toEqual(expected);
    });

    it('ADD_TOAST should put toast at the beginning', () => {
        initialState = [ { key: 'FIRST_TOAST' } ];

        const action = { type: actions.ADD_TOAST, toast: TOAST_ERROR_MOCK };
        const state  = reducer(initialState, action);

        const expected = [ TOAST_ERROR_MOCK, ...initialState ];

        expect(state).toEqual(expected);
    });

    it('REMOVE_TOAST', () => {
        const toastMock = { ...TOAST_ERROR_MOCK, id: 'test1' };

        initialState = [ TOAST_ERROR_MOCK,  toastMock ];

        const action = { type: actions.REMOVE_TOAST, id: TOAST_ERROR_MOCK.id };
        const state  = reducer(initialState, action);

        expect(state).toEqual([ toastMock ]);
    });

    it('REMOVE_TOAST_BY_KEY', () => {
        const toastMock = { ...TOAST_ERROR_MOCK, key: 'test key' };

        initialState = [ TOAST_ERROR_MOCK, TOAST_ERROR_MOCK, toastMock ];

        const action = { type: actions.REMOVE_TOAST_BY_KEY, key: TOAST_ERROR_MOCK.key };
        const state  = reducer(initialState, action);

        expect(state).toEqual([ toastMock ]);
    });

    it('LOGOUT', () => {
        const toastMock = { ...TOAST_ERROR_MOCK, showOnSessionDestroy: true };

        initialState = [ TOAST_ERROR_MOCK, toastMock, TOAST_ERROR_MOCK ];

        const state  = reducer(initialState, { type: sessionsActions.LOGOUT });

        expect(state).toEqual([ toastMock ]);
    });
});

import * as actions from '../constants/actions/sessions';
import reducer      from './sessions';

describe('sessions reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            isFirstLogin     : false,
            isUserLoggedIn   : false,
            isSessionChecked : false
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('LOGIN', () => {
        const action = { type: actions.LOGIN };
        const state  = reducer(initialState, action);

        expect(state.isSessionChecked).toBeTruthy();
        expect(state.isUserLoggedIn).toBeTruthy();
    });

    it('LOGOUT', () => {
        const action = { type: actions.LOGOUT };
        const state  = reducer({ ...initialState, isUserLoggedIn: true }, action);

        expect(state.isSessionChecked).toBeTruthy();
        expect(state.isUserLoggedIn).toBeFalsy();
    });

    it('LOGOUT', () => {
        const action = { type: actions.SESSION_CKECKED };
        const state  = reducer({ ...initialState, isUserLoggedIn: true }, action);

        expect(state.isSessionChecked).toBeTruthy();
        expect(state.isUserLoggedIn).toBeTruthy();
    });
});

import * as actions         from '../constants/actions/view';
import * as sessionsActions from '../constants/actions/sessions';
import { VIEW_MODAL_MOCK }  from '../__mocks__/viewMock';
import reducer              from './view';

describe('view reducer', () => {
    let initialState;

    // eslint-disable-next-line no-magic-numbers
    const mockDate = new Date();

    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    beforeEach(() => {
        initialState = {
            modals : []
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('OPEN_MODAL', () => {
        const action = { type: actions.OPEN_MODAL, payload: VIEW_MODAL_MOCK };

        const state  = reducer(initialState, action);

        const expected = [ {
            ...VIEW_MODAL_MOCK,
            createdAt : new Date()
        } ];

        expect(state.modals).toEqual(expected);
    });

    it('CLOSE_MODAL', () => {
        initialState.modals = [ { key: 'FIRST_MODAL' } ];

        const modals = [];

        const action = { type: actions.CLOSE_MODAL, payload: { modals } };
        const state  = reducer(initialState, action);

        expect(state.modals).toEqual(modals);
    });

    it('CLOSE_ALL_MODALS', () => {
        initialState.modals = [ VIEW_MODAL_MOCK, VIEW_MODAL_MOCK, VIEW_MODAL_MOCK ];

        const action = { type: actions.CLOSE_ALL_MODALS };
        const state  = reducer(initialState, action);

        expect(state).toEqual({ modals: [] });
    });

    it('CLOSE_ALL_MODALS', () => {
        const action = { type: sessionsActions.LOGOUT };
        const state  = reducer({ ...initialState, modals: [ { id: 'test id' } ] }, action);

        expect(state).toEqual(initialState);
    });
});

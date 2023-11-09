import configureMockStore   from 'redux-mock-store';
import thunk                from 'redux-thunk';

import API                  from '../../__mocks__/apiMock';
import { VIEW_MODAL_MOCK } from '../../__mocks__/viewMock';

import * as actionTypes     from '../../constants/actions/view';

import View               from './view';

jest.mock('../../__mocks__/apiMock');

const mockStore = configureMockStore([ thunk ]);


describe('view module', () => {
    let store;
    const viewModule = new View(API);

    beforeEach(() => {
        store = mockStore({});
    });

    describe('openModal()', () => {
        it('should open new modal', () => {
            const name = 'test name';
            const props = 'test props';

            const expectedActions = [
                { type: actionTypes.OPEN_MODAL, payload: { name, props } }
            ];

            store.dispatch(viewModule.openModal(name, props));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('closeModal()', () => {
        it('should close specific modal by name', () => {
            const modalNameMock = 'test modal';

            store = mockStore({
                view : {
                    modals : [ VIEW_MODAL_MOCK, { ...VIEW_MODAL_MOCK, name: modalNameMock } ]
                }
            });

            const expectedActions = [
                { type: actionTypes.CLOSE_MODAL, payload: { modals: [ VIEW_MODAL_MOCK ] } }
            ];

            store.dispatch(viewModule.closeModal(modalNameMock));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should close all modals', () => {
            const modalNameMock = 'test modal';

            store = mockStore({
                view : {
                    modals : [ VIEW_MODAL_MOCK, { ...VIEW_MODAL_MOCK, name: modalNameMock } ]
                }
            });

            const expectedActions = [ { type: actionTypes.CLOSE_ALL_MODALS } ];

            store.dispatch(viewModule.closeModal(void 0, true));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('closeAllModals()', () => {
        it('should dispatch action', () => {
            const expectedActions = [ { type: actionTypes.CLOSE_ALL_MODALS } ];

            store.dispatch(viewModule.closeAllModals());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

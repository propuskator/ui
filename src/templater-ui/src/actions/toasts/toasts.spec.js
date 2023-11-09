/* eslint-disable max-lines-per-function */
import configureMockStore   from 'redux-mock-store';
import thunk                from 'redux-thunk';
import { v4 as uuidv4 }     from 'uuid';

import API                  from '../../__mocks__/apiMock';
import { TOAST_ERROR_MOCK } from '../../__mocks__/toastsMock';

import * as actionTypes     from '../../constants/actions/toasts';
import { TOASTS_KEYS }      from './../../constants/toasts';

import Toasts               from './toasts';

jest.mock('uuid');
jest.mock('../../__mocks__/apiMock');

const mockStore = configureMockStore([ thunk ]);

describe('toasts module', () => {
    let store;
    const toastsModule = new Toasts(API);

    // mocks
    uuidv4.mockImplementation(() => TOAST_ERROR_MOCK.id);

    beforeEach(() => {
        store = mockStore({});
    });

    describe('addToast()', () => {
        it('should add new toast', async () => {
            store = mockStore({
                sessions : {
                    isUserLoggedIn : true
                },
                toasts : []
            });

            const expectedActions = [
                { type: actionTypes.ADD_TOAST, toast: TOAST_ERROR_MOCK }
            ];

            jest.useFakeTimers();

            await store.dispatch(toastsModule.addToast(TOAST_ERROR_MOCK));

            jest.runAllTimers();

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should prevent duplicate toast', async () => {
            store = mockStore({
                sessions : {
                    isUserLoggedIn : true
                },
                toasts : [ TOAST_ERROR_MOCK ]
            });

            const expectedActions = [
                { type: actionTypes.REMOVE_TOAST, id: TOAST_ERROR_MOCK.id },
                { type: actionTypes.ADD_TOAST, toast: TOAST_ERROR_MOCK }
            ];

            jest.useFakeTimers();

            await store.dispatch(toastsModule.addToast(TOAST_ERROR_MOCK));

            jest.runAllTimers();

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should not add toast if user logouted', async () => {
            store = mockStore({
                sessions : {
                    isUserLoggedIn : false
                },
                toasts : [ ]
            });

            jest.useFakeTimers();

            await store.dispatch(toastsModule.addToast(TOAST_ERROR_MOCK));

            jest.runAllTimers();

            expect(store.getActions()).toEqual([]);
        });
    });

    describe('removeToastByKey()', () => {
        it('should remove toast by key if duplicate exists', async () => {
            store = mockStore({
                toasts : [ TOAST_ERROR_MOCK ]
            });

            const expectedActions = [
                { type: actionTypes.REMOVE_TOAST_BY_KEY, key: TOASTS_KEYS.brokerConnectionLost }
            ];

            await store.dispatch(toastsModule.removeToastByKey(TOASTS_KEYS.brokerConnectionLost));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

import configureMockStore           from 'redux-mock-store';
import thunk                        from 'redux-thunk';
// MOCK
import API                          from '../../__mocks__/apiMock';
import { SUCCESS_PAYLOAD_MOCK }     from '../../__mocks__/updaterMock';
import localStorageMock             from '../../__mocks__/localStorage';

import * as actionTypes             from '../../constants/actions/updater';
import * as localStorageConstants   from '../../constants/localStorage';
import * as localStorageUtils       from '../../utils/helpers/localStorage';

import UpdaterService               from './updater';

jest.mock('../../__mocks__/apiMock');

Object.defineProperty(window, 'localStorage', {
    value : localStorageMock
});

const mockStore = configureMockStore([ thunk ]);

describe('updater service actions', () => {
    let store;
    const updateModule = new UpdaterService(API);

    // API
    API.updateService.getChangelog = jest.fn().mockReturnValue(Promise.resolve(SUCCESS_PAYLOAD_MOCK));

    beforeEach(() => {
        store = mockStore({});
        localStorage.clear();

        updateModule.openModal = jest.fn(() => ({ type: 'TEST_OPEN_MODAL' }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchChangelog()', () => {
        it('should success fetch changelogs', async () => {
            updateModule.openModal = undefined;

            const expectedActions = [
                { type: actionTypes.FETCH_CHANGELOG_REQUEST },
                { type: actionTypes.FETCH_CHANGELOG_SUCCESS, payload: SUCCESS_PAYLOAD_MOCK }
            ];

            await store.dispatch(updateModule.fetchChangelog());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should not open modal', async () => {
            updateModule.openModal = undefined;
            const expectedActions = [
                { type: actionTypes.FETCH_CHANGELOG_REQUEST },
                { type: actionTypes.FETCH_CHANGELOG_SUCCESS, payload: SUCCESS_PAYLOAD_MOCK }
            ];

            await store.dispatch(updateModule.fetchChangelog());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should init localstorage and open modal', async () => {
            const expectedActions = [
                { type: actionTypes.FETCH_CHANGELOG_REQUEST },
                { type: actionTypes.FETCH_CHANGELOG_SUCCESS, payload: SUCCESS_PAYLOAD_MOCK },
                { type: 'TEST_OPEN_MODAL' }
            ];

            const expectedParams = { updated_at: SUCCESS_PAYLOAD_MOCK.updated_at, allowNotify: true };

            const getDataStub = jest.spyOn(localStorageUtils, 'getData');
            const saveDataStub = jest.spyOn(localStorageUtils, 'saveData');

            await store.dispatch(updateModule.fetchChangelog());

            expect(getDataStub).toHaveBeenCalledWith(localStorageConstants.UPDATE_INFO);
            expect(saveDataStub).toHaveBeenCalledWith(localStorageConstants.UPDATE_INFO, expectedParams);
            expect(localStorage.getStore()).toEqual({
                [localStorageConstants.UPDATE_INFO] : JSON.stringify(expectedParams)
            });

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should not open modal if user disabled notification', async () => {
            const expectedActions = [
                { type: actionTypes.FETCH_CHANGELOG_REQUEST },
                { type: actionTypes.FETCH_CHANGELOG_SUCCESS, payload: SUCCESS_PAYLOAD_MOCK }
            ];

            const expectedParams = { updated_at: SUCCESS_PAYLOAD_MOCK.updated_at, allowNotify: false };

            localStorage.setItem([ localStorageConstants.UPDATE_INFO ], JSON.stringify(expectedParams));

            const getDataStub = jest.spyOn(localStorageUtils, 'getData').mockImplementation(() => expectedParams);
            const saveDataStub = jest.spyOn(localStorageUtils, 'saveData');

            await store.dispatch(updateModule.fetchChangelog());

            expect(getDataStub).toHaveBeenCalledWith(localStorageConstants.UPDATE_INFO);
            expect(saveDataStub).not.toHaveBeenCalled();

            expect(localStorage.getStore()).toEqual({
                [localStorageConstants.UPDATE_INFO] : JSON.stringify(expectedParams)
            });

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

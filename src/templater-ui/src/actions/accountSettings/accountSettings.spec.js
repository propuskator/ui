/* eslint-disable max-lines-per-function */
import configureMockStore        from 'redux-mock-store';
import thunk                     from 'redux-thunk';

import API                       from '../../__mocks__/apiMock';

import * as actionTypes          from '../../constants/actions/accountSettings';
import * as sessionActionTypes   from '../../constants/actions/sessions';

import { ACCOUNT_SETTINGS_MOCK } from '../../__mocks__/accountSettingsMock';
import AccountSettings           from './accountSettings';

jest.mock('../../__mocks__/apiMock');

const mockStore = configureMockStore([ thunk ]);

describe('account settings actions', () => {
    let store;
    const actions = new AccountSettings(API);

    beforeEach(() => {
        store = mockStore({});
    });

    describe('fetchAccountSettings()', () => {
        it('success fetch settings', async () => {
            API.accountSettings.getData = jest.fn().mockReturnValue(Promise.resolve(ACCOUNT_SETTINGS_MOCK));

            const expectedActions = [
                { type: actionTypes.FETCH_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.FETCH_ACCOUNT_SETTINGS_SUCCESS, payload: ACCOUNT_SETTINGS_MOCK }
            ];

            await store.dispatch(actions.fetchAccountSettings());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('success init', async () => {
            const expectedActions = [
                { type: actionTypes.FETCH_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.FETCH_ACCOUNT_SETTINGS_SUCCESS, payload: ACCOUNT_SETTINGS_MOCK },
                { type: sessionActionTypes.SESSION_CKECKED }
            ];

            API.accountSettings.getData = jest.fn().mockReturnValue(Promise.resolve(ACCOUNT_SETTINGS_MOCK));

            await store.dispatch(actions.fetchAccountSettings({ isInit: true }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed fetch account settings', async () => {
            const expectedActions = [
                { type: actionTypes.FETCH_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.FETCH_ACCOUNT_SETTINGS_ERROR }
            ];

            API.accountSettings.getData = jest.fn().mockReturnValue(Promise.reject());

            try {
                await store.dispatch(actions.fetchAccountSettings());
            // eslint-disable-next-line no-empty
            } catch { }

            expect(store.getActions()).toEqual(expectedActions);
        });
    });


    describe('updateAccountSettings()', () => {
        it('success update settings', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type    : actionTypes.UPDATE_ACCOUNT_SETTINGS_SUCCESS,
                    payload : { accountSettings: ACCOUNT_SETTINGS_MOCK } }
            ];

            const onSuccess = jest.fn();

            API.accountSettings.edit = jest.fn().mockReturnValue(Promise.resolve(ACCOUNT_SETTINGS_MOCK));

            await store.dispatch(actions.updateAccountSettings({ onSuccess }));

            expect(onSuccess).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed update settings', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_ERROR }
            ];

            const onError = jest.fn();

            API.accountSettings.edit = jest.fn().mockReturnValue(Promise.reject());

            await store.dispatch(actions.updateAccountSettings({ onError }));

            expect(onError).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('updatePassword()', () => {
        it('success update password', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_SUCCESS, payload: { accountSettings: { } } }
            ];

            const onSuccess = jest.fn();

            API.accountSettings.editPassword = jest.fn().mockReturnValue(Promise.resolve());

            await store.dispatch(actions.updatePassword({ onSuccess }));

            expect(onSuccess).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed update password', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_ERROR }
            ];

            const onError = jest.fn();

            API.accountSettings.editPassword = jest.fn().mockReturnValue(Promise.reject());

            await store.dispatch(actions.updatePassword({ onError }));

            expect(onError).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('updateUserAvatar()', () => {
        it('update avatar without File', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_SUCCESS, payload: { accountSettings: { } } }
            ];

            API.accountSettings.edit = jest.fn().mockReturnValue(Promise.resolve());

            await store.dispatch(actions.updateUserAvatar());

            expect(API.accountSettings.edit).toHaveBeenCalledWith({
                avatar_url : ''
            });
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('update avatar if File exists', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_SUCCESS, payload: { accountSettings: { } } }
            ];

            const dataMock = {
                avatarImg : 'fake'
            };

            const respMock = {
                'url'  : '3bab5101-a2c2-41a9',
                'path' : 'test path'
            };

            API.files.uploadFile = jest.fn().mockReturnValue(Promise.resolve(respMock));
            API.accountSettings.edit = jest.fn().mockReturnValue(Promise.resolve());

            await store.dispatch(actions.updateUserAvatar({ data: dataMock }));

            expect(API.accountSettings.edit).toHaveBeenCalledWith({
                avatar_url : respMock.path
            });
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('failed update avatar', async () => {
            const expectedActions = [
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_REQUEST },
                { type: actionTypes.UPDATE_ACCOUNT_SETTINGS_ERROR }
            ];

            API.accountSettings.edit = jest.fn().mockReturnValue(Promise.reject());

            await store.dispatch(actions.updateUserAvatar());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('sendReport()', () => {
        it('success send report', async () => {
            const expectedActions = [
                { type: actionTypes.SEND_REPORT_REQUEST },
                { type: actionTypes.SEND_REPORT_SUCCESS }
            ];

            const onSuccess = jest.fn();

            API.references = { getByName: jest.fn().mockReturnValue(Promise.resolve([ 'web_type' ])) };
            API.accountSettings.sendReport = jest.fn().mockReturnValue(Promise.resolve());

            await store.dispatch(actions.sendReport({ onSuccess }));

            expect(onSuccess).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

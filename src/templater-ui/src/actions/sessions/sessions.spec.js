/* eslint-disable max-lines-per-function, object-curly-newline */
import configureMockStore from 'redux-mock-store';
import thunk              from 'redux-thunk';

import API                from '../../__mocks__/apiMock';
import { AUTH_RESP_MOCK } from '../../__mocks__/sessionsMock';
import { HISTORY_MOCK }   from '../../__mocks__/history';

import * as actionTypes   from '../../constants/actions/sessions';
import * as ROUTES        from '../../constants/routes';
import { TOASTS_KEYS }    from '../../constants/toasts';

import Sessions           from './sessions';

jest.mock('../../__mocks__/apiMock');

const mockStore = configureMockStore([ thunk ]);

describe('sessions module', () => {
    let store;
    const sessionsModule = new Sessions(API);

    API.sessions.login         = jest.fn().mockReturnValue(Promise.resolve(AUTH_RESP_MOCK));
    API.sessions.register      = jest.fn().mockReturnValue(Promise.resolve(AUTH_RESP_MOCK));
    API.sessions.loginFacebook = jest.fn().mockReturnValue(Promise.resolve(AUTH_RESP_MOCK));
    API.sessions.loginGoogle   = jest.fn().mockReturnValue(Promise.resolve(AUTH_RESP_MOCK));
    API.sessions.logout        = jest.fn().mockReturnValue(Promise.resolve());

    beforeEach(() => {
        store = mockStore({});
        sessionsModule.removeToastByKey = void 0;
        sessionsModule.connectBroker =  void 0;
        sessionsModule.history = void 0;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCsrf()', () => {
        it('should fetch csrf token', async () => {
            sessionsModule.removeToastByKey = jest.fn(() => ({ type: 'TEST_REMOVE_TOAST' }));

            const tokenMock = 'fds423dcxvad';

            API.sessions.getCsrf = jest.fn().mockReturnValue(Promise.resolve({
                token : tokenMock
            }));

            await store.dispatch(sessionsModule.getCsrf());

            expect(API.sessions.getCsrf).toHaveBeenCalled();
            expect(API.apiClient.setCsrfToken).toHaveBeenCalledWith(tokenMock);
            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.csrfError);
        });
    });

    describe('login()', () => {
        const loginExpectedActions = [ {
            type    : actionTypes.LOGIN,
            payload : {
                id         : AUTH_RESP_MOCK.id,
                avatar_url : AUTH_RESP_MOCK.avatar_url,
                login      : AUTH_RESP_MOCK.login
            }
        } ];

        it('should login in', async () => {
            await store.dispatch(sessionsModule.login());

            expect(store.getActions()).toEqual(loginExpectedActions);
        });

        it('should trigger remove toasts by key for several types', async () => {
            sessionsModule.removeToastByKey = jest.fn(() => ({ type: 'TEST_REMOVE_TOAST' }));

            const expectedActions = [
                { type: 'TEST_REMOVE_TOAST' },
                { type: 'TEST_REMOVE_TOAST' },
                { type: 'TEST_REMOVE_TOAST' },
                ...(loginExpectedActions || [])
            ];

            await store.dispatch(sessionsModule.login());

            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.login);
            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.csrfError);
            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.forbidden);
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should connect to broker', async () => {
            sessionsModule.connectBroker = jest.fn();

            await store.dispatch(sessionsModule.login());

            expect(sessionsModule.connectBroker).toHaveBeenCalled();
        });

        it('should redirect to initial page', async () => {
            sessionsModule.history = HISTORY_MOCK;

            await store.dispatch(sessionsModule.login());

            expect(sessionsModule.history.push).toHaveBeenCalledWith(ROUTES.INITIAL_PAGE);
        });

        it('should dispatch error action', async () => {
            const expectedActions = [
                { type: actionTypes.LOGIN_ERROR }
            ];

            API.sessions.login = jest.fn().mockReturnValue(Promise.reject());

            await store.dispatch(sessionsModule.login());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('loginFacebook()', () => {
        const accessToken = 'testToken';

        const loginExpectedActions = [ {
            type    : actionTypes.LOGIN,
            payload : {
                id         : AUTH_RESP_MOCK.id,
                avatar_url : AUTH_RESP_MOCK.avatar_url,
                login      : AUTH_RESP_MOCK.login
            }
        } ];

        it('should accept access token', async () => {
            await store.dispatch(sessionsModule.loginFacebook({ accessToken }));

            expect(API.sessions.loginFacebook).toHaveBeenCalledWith({ accessToken });
        });

        it('should login in', async () => {
            await store.dispatch(sessionsModule.loginFacebook({ accessToken }));

            expect(store.getActions()).toEqual(loginExpectedActions);
        });

        it('should connect to broker', async () => {
            sessionsModule.connectBroker = jest.fn();

            await store.dispatch(sessionsModule.loginFacebook({ accessToken }));

            expect(sessionsModule.connectBroker).toHaveBeenCalled();
        });

        it('should redirect to initial page', async () => {
            sessionsModule.history = HISTORY_MOCK;

            await store.dispatch(sessionsModule.loginFacebook({ accessToken }));

            expect(sessionsModule.history.push).toHaveBeenCalledWith(ROUTES.INITIAL_PAGE);
        });
    });

    describe('loginGoogle()', () => {
        const idToken = 'testToken';

        const loginExpectedActions = [ {
            type    : actionTypes.LOGIN,
            payload : {
                id         : AUTH_RESP_MOCK.id,
                avatar_url : AUTH_RESP_MOCK.avatar_url,
                login      : AUTH_RESP_MOCK.login
            }
        } ];

        it('should accept token id', async () => {
            await store.dispatch(sessionsModule.loginGoogle({ idToken }));

            expect(API.sessions.loginGoogle).toHaveBeenCalledWith({ idToken });
        });

        it('should login in', async () => {
            await store.dispatch(sessionsModule.loginGoogle({ idToken }));

            expect(store.getActions()).toEqual(loginExpectedActions);
        });

        it('should connect to broker', async () => {
            sessionsModule.connectBroker = jest.fn();

            await store.dispatch(sessionsModule.loginGoogle({ idToken }));

            expect(sessionsModule.connectBroker).toHaveBeenCalled();
        });

        it('should redirect to initial page', async () => {
            sessionsModule.history = HISTORY_MOCK;

            await store.dispatch(sessionsModule.loginGoogle({ idToken }));

            expect(sessionsModule.history.push).toHaveBeenCalledWith(ROUTES.INITIAL_PAGE);
        });
    });

    describe('register()', () => {
        const registerExpectedActions = [
            { type    : actionTypes.LOGIN,
                payload : {
                    id         : AUTH_RESP_MOCK.id,
                    avatar_url : AUTH_RESP_MOCK.avatar_url,
                    login      : AUTH_RESP_MOCK.login
                }
            }
        ];
        const FIRST_LOGIN_ACTION = { type: actionTypes.FIRST_LOGIN };

        it('should register', async () => {
            await store.dispatch(sessionsModule.register());

            expect(store.getActions()).toEqual([
                FIRST_LOGIN_ACTION,
                ...registerExpectedActions
            ]);
        });

        it('should trigger remove toasts by key for several types', async () => {
            sessionsModule.removeToastByKey = jest.fn(() => ({ type: 'TEST_REMOVE_TOAST' }));

            const expectedActions = [
                FIRST_LOGIN_ACTION,
                { type: 'TEST_REMOVE_TOAST' },
                { type: 'TEST_REMOVE_TOAST' },
                { type: 'TEST_REMOVE_TOAST' },
                ...(registerExpectedActions || [])
            ];

            await store.dispatch(sessionsModule.register());

            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.login);
            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.csrfError);
            expect(sessionsModule.removeToastByKey).toHaveBeenCalledWith(TOASTS_KEYS.forbidden);
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should connect to broker', async () => {
            sessionsModule.connectBroker = jest.fn();

            await store.dispatch(sessionsModule.register());

            expect(sessionsModule.connectBroker).toHaveBeenCalled();
        });

        it('should redirect to initial page', async () => {
            sessionsModule.history = HISTORY_MOCK;

            await store.dispatch(sessionsModule.register());

            expect(sessionsModule.history.push).toHaveBeenCalledWith(ROUTES.INITIAL_PAGE);
        });
    });

    describe('logout()', () => {
        it('should logout', async () => {
            const expectedActions = [
                { type: actionTypes.LOGOUT }
            ];

            await store.dispatch(sessionsModule.logout());

            expect(store.getActions()).toEqual(expectedActions);
            expect(API.sessions.logout).toHaveBeenCalled();
        });

        it('should redirect to login page', async () => {
            sessionsModule.history = HISTORY_MOCK;
            const expectedActions = [
                { type: actionTypes.LOGOUT }
            ];

            await store.dispatch(sessionsModule.logout());

            expect(store.getActions()).toEqual(expectedActions);
            expect(API.sessions.logout).toHaveBeenCalled();
            expect(sessionsModule.history.replace).toHaveBeenCalledWith(ROUTES.LOGIN);
        });

        it('should disconnect broker', async () => {
            const disconnectAction = { type: 'DISCONNECT_ACTION_TYPE' };

            const expectedActions = [
                { type: actionTypes.LOGOUT },
                disconnectAction
            ];

            sessionsModule.disconnectBroker = jest.fn(() => disconnectAction);

            await store.dispatch(sessionsModule.logout());

            expect(store.getActions()).toEqual(expectedActions);
            expect(API.sessions.logout).toHaveBeenCalled();
            expect(sessionsModule.disconnectBroker).toHaveBeenCalled();
        });
    });
});

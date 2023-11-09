/* eslint-disable max-lines-per-function */
import configureMockStore        from 'redux-mock-store';
import thunk                     from 'redux-thunk';

import API                       from '../../__mocks__/apiMock';
import { MQTT_CREDENTIALS_MOCK } from '../../__mocks__/brokerMock';

import * as actionTypes          from '../../constants/actions/broker';

import Broker                    from './broker';

jest.mock('../../__mocks__/apiMock');

const mockStore = configureMockStore([ thunk ]);

describe('broker module', () => {
    let store;
    const brokerModule = new Broker(API);

    brokerModule.addToast                 = jest.fn(() => ({ type: 'TEST_ADD_TOAST' }));
    brokerModule.removeToastByKey         = jest.fn(() => ({ type: 'TEST_REMOVE_TOAST' }));
    brokerModule.logout                   = jest.fn(() => ({ type: 'TEST_LOGOUT' }));
    brokerModule.fetchDataOnBrokerConnect = jest.fn();

    beforeEach(() => {
        store = mockStore({});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('displayConnectionNotification()', () => {
        it('should show broker connection lost toast', async () => {
            store = mockStore({
                broker : {
                    isInternetReachable : true
                }
            });

            jest.useFakeTimers();

            await store.dispatch(brokerModule.displayConnectionNotification());

            jest.runAllTimers();

            expect(brokerModule.addToast).toHaveBeenCalledWith(expect.objectContaining({
                type             : 'error',
                withCloseAbility : false
            }));
            expect(brokerModule.removeToastByKey).not.toHaveBeenCalled();
        });

        it('should hide broker connection lost toast', async () => {
            store = mockStore({
                broker : {
                    isInternetReachable : true,
                    isConnected         : true
                }
            });

            const expectedActions = [
                { type: 'TEST_REMOVE_TOAST' }
            ];

            jest.useFakeTimers();

            await store.dispatch(brokerModule.displayConnectionNotification());

            jest.runAllTimers();

            expect(brokerModule.addToast).not.toHaveBeenCalled();
            expect(brokerModule.removeToastByKey).toHaveBeenCalled();
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('networkStatusUpdate()', () => {
        it('should update network state', async () => {
            const isInternetReachable = true;

            const expectedActions = [
                {
                    type    : actionTypes.NETWORK_STATUS_UPDATE,
                    payload : { isInternetReachable }
                }
            ];

            await store.dispatch(brokerModule.networkStatusUpdate({ isInternetReachable }));

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('handleBrokerConnectionLost()', () => {
        it('should dispatch connection lost', async () => {
            const expectedActions = [
                { type: actionTypes.CONNECT_LOST }
            ];

            await store.dispatch(brokerModule.handleBrokerConnectionLost());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('handleBrokerConnectionRestored()', () => {
        it('should dispatch restore connection', async () => {
            const expectedActions = [
                { type: actionTypes.CONNECT_RESTORE }
            ];

            await store.dispatch(brokerModule.handleBrokerConnectionRestored());
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getMqttCredentials()', () => {
        it('should skip fetch if credentials exists', async () => {
            const initialState = {
                broker : {
                    credentials : MQTT_CREDENTIALS_MOCK
                }
            };

            store = mockStore(initialState);

            const returned = await store.dispatch(brokerModule.getMqttCredentials());

            expect(store.getActions()).toEqual([]);
            expect(returned).toBe(initialState.broker.credentials);
        });

        it('should fetch mqtt credentials', async () => {
            const expectedActions = [
                { type: actionTypes.GET_MQTT_CREDENTIALS_REQUEST },
                { type: actionTypes.GET_MQTT_CREDENTIALS_SUCCESS, payload: { data: MQTT_CREDENTIALS_MOCK } }
            ];

            API.accountSettings.getData = jest.fn()
                .mockReturnValue(Promise.resolve({ mqttCredentials: MQTT_CREDENTIALS_MOCK }));

            const returned  = await store.dispatch(brokerModule.getMqttCredentials());

            expect(store.getActions()).toEqual(expectedActions);
            expect(returned).toBeUndefined();
        });

        it('should logout if wrong token', async () => {
            const expectedActions = [
                { type: actionTypes.GET_MQTT_CREDENTIALS_REQUEST },
                { type: 'TEST_LOGOUT' }
            ];

            // eslint-disable-next-line prefer-promise-reject-errors
            API.accountSettings.getData = jest.fn().mockReturnValue(Promise.reject({
                code : 'WRONG_TOKEN'
            }));

            await store.dispatch(brokerModule.getMqttCredentials());

            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('connectBroker()', () => {
        it('should connect if credentials dont exist', async () => {
            const expectedActions = [
                { type: actionTypes.CONNECT_BROKER_REQUEST },
                { type: actionTypes.GET_MQTT_CREDENTIALS_REQUEST },
                { type: actionTypes.GET_MQTT_CREDENTIALS_SUCCESS, payload: { data: undefined } }
            ];

            API.accountSettings.getData = jest.fn().mockReturnValue(Promise.resolve());

            await store.dispatch(brokerModule.connectBroker());

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should connect with connection params', async () => {
            const mockData = 'data mock';
            const expectedActions = [
                { type: actionTypes.CONNECT_BROKER_REQUEST },
                { type: actionTypes.GET_MQTT_CREDENTIALS_SUCCESS, payload: { data: mockData } }
            ];

            await store.dispatch(brokerModule.connectBroker({ data: mockData }));

            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should connect to smart home', async () => {
            const expectedActions = [
                { type: actionTypes.CONNECT_BROKER_REQUEST },
                {
                    type    : actionTypes.GET_MQTT_CREDENTIALS_SUCCESS,
                    payload : { data: MQTT_CREDENTIALS_MOCK }
                },
                {
                    type    : actionTypes.CONNECT_BROKER_SUCCESS,
                    payload : { brokerUrl: MQTT_CREDENTIALS_MOCK.sandbox_url_wss, isConnected: true }
                }
            ];

            brokerModule.smartHome = {
                connect : jest.fn()
            };

            await store.dispatch(brokerModule.connectBroker({ data: MQTT_CREDENTIALS_MOCK }));

            expect(store.getActions()).toEqual(expectedActions);
            expect(brokerModule.smartHome.connect).toHaveBeenCalled();
            expect(brokerModule.fetchDataOnBrokerConnect).toHaveBeenCalled();
        });

        it('should dispatch broker error', async () => {
            const expectedActions = [
                { type: actionTypes.CONNECT_BROKER_REQUEST },
                { type: actionTypes.GET_MQTT_CREDENTIALS_SUCCESS, payload: { data: MQTT_CREDENTIALS_MOCK } },
                { type: actionTypes.CONNECT_BROKER_ERROR }
            ];

            brokerModule.smartHome = {
                connect : jest.fn().mockReturnValue(Promise.reject())
            };

            const onError = jest.fn();

            await store.dispatch(brokerModule.connectBroker({ data: MQTT_CREDENTIALS_MOCK, onError }));

            expect(store.getActions()).toEqual(expectedActions);
            expect(onError).toHaveBeenCalled();
        });
    });

    describe('disconnectBroker()', () => {
        it('should disconnect broker', async () => {
            const expectedActions = [
                { type: actionTypes.DISCONNECT_BROKER }
            ];

            brokerModule.smartHome = {
                disconnect : jest.fn().mockReturnValue(Promise.resolve())
            };

            await store.dispatch(brokerModule.disconnectBroker());

            expect(store.getActions()).toEqual(expectedActions);
            expect(brokerModule.smartHome.disconnect).toHaveBeenCalled();
        });

        it('should not disconnect broker without smartHome', async () => {
            brokerModule.smartHome = void 0;

            await store.dispatch(brokerModule.disconnectBroker());

            expect(store.getActions()).toEqual([]);
        });
    });

    describe('reconnectBroker()', () => {
        it('should reconnect broker', async () => {
            const initialState = {
                broker : {
                    credentials : MQTT_CREDENTIALS_MOCK
                }
            };

            const expectedActions = [
                {
                    type    : actionTypes.GET_MQTT_CREDENTIALS_SUCCESS,
                    payload : { data: MQTT_CREDENTIALS_MOCK }
                },
                {
                    type    : actionTypes.RECONNECT_BROKER_SUCCESS,
                    payload : { brokerUrl: MQTT_CREDENTIALS_MOCK.sandbox_url_wss }
                }
            ];

            store = mockStore(initialState);

            brokerModule.smartHome = {
                reconnect : jest.fn().mockReturnValue(Promise.resolve())
            };

            await store.dispatch(brokerModule.reconnectBroker({ data: MQTT_CREDENTIALS_MOCK }));

            expect(store.getActions()).toEqual(expectedActions);
            expect(brokerModule.smartHome.reconnect).toHaveBeenCalled();
            expect(brokerModule.fetchDataOnBrokerConnect).toHaveBeenCalled();
        });

        it('should not reconnect broker without smarthome', async () => {
            brokerModule.smartHome = void 0;
            const initialState = {
                broker : {
                    credentials : MQTT_CREDENTIALS_MOCK
                }
            };

            store = mockStore(initialState);

            await store.dispatch(brokerModule.reconnectBroker({ data: MQTT_CREDENTIALS_MOCK }));

            const expectedActions = [
                {
                    type    : actionTypes.GET_MQTT_CREDENTIALS_SUCCESS,
                    payload : { data: MQTT_CREDENTIALS_MOCK }
                }
            ];

            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

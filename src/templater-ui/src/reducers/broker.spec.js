import * as actions              from '../constants/actions/broker';

import { MQTT_CREDENTIALS_MOCK } from '../__mocks__/brokerMock';

import reducer                   from './broker';

describe('broker reducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = {
            isConnected         : false,
            isLoading           : true,
            isInternetReachable : true,
            brokerUrl           : '',
            credentials         : null
        };
    });

    it('should return initial state', () => {
        const result = reducer(undefined, {});

        expect(result).toEqual(initialState);
    });

    it('GET_MQTT_CREDENTIALS_SUCCESS', () => {
        const action = { type: actions.GET_MQTT_CREDENTIALS_SUCCESS, payload: { data: MQTT_CREDENTIALS_MOCK } };
        const state  = reducer(initialState, action);

        const expected = {
            ...initialState,
            credentials : MQTT_CREDENTIALS_MOCK
        };

        expect(state).toEqual(expected);
    });

    it('CONNECT_BROKER_REQUEST', () => {
        const action = { type: actions.CONNECT_BROKER_REQUEST };
        const state  = reducer(initialState, action);

        expect(state.isLoading).toBeTruthy();
    });

    it('CONNECT_BROKER_SUCCESS', () => {
        const action = {
            type    : actions.CONNECT_BROKER_SUCCESS,
            payload : { brokerUrl: 'test url' }
        };

        const state = reducer(initialState, action);

        expect(state.isLoading).toBeFalsy();
        expect(state.isConnected).toBeTruthy();
        expect(state.isConnected).toBeTruthy();
        expect(state.brokerUrl).toBe('test url');
    });

    it('CONNECT_BROKER_ERROR', () => {
        const action = { type: actions.CONNECT_BROKER_ERROR };

        initialState = {
            isConnected : true,
            isLoading   : true
        };

        const state = reducer(initialState, action);

        expect(state.isConnected).toBeFalsy();
        expect(state.isLoading).toBeFalsy();
    });

    it('NETWORK_STATUS_UPDATE', () => {
        const action = { type: actions.NETWORK_STATUS_UPDATE, payload: false };
        const state  = reducer(initialState, action);

        expect(state.isInternetReachable).toBeFalsy();
    });


    it('CONNECT_LOST', () => {
        const action = { type: actions.CONNECT_LOST };
        const state  = reducer(initialState, action);

        expect(state.isConnected).toBeFalsy();
    });

    it('CONNECT_RESTORE', () => {
        const action = { type: actions.CONNECT_RESTORE };
        const state  = reducer(initialState, action);

        expect(state.isConnected).toBeTruthy();
    });

    it('RECONNECT_BROKER_SUCCESS', () => {
        const action = { type: actions.RECONNECT_BROKER_SUCCESS, payload: { brokerUrl: 'test broker' } };
        const state  = reducer(initialState, action);
        const expected = {
            ...initialState,
            isConnected : true,
            isLoading   : false,
            brokerUrl   : 'test broker'
        };

        expect(state).toEqual(expected);
    });

    it('DISCONNECT_BROKER', () => {
        const action = { type: actions.DISCONNECT_BROKER };

        const state  = reducer({ ...initialState, isConnected: true }, action);

        expect(state).toEqual(initialState);
    });
});

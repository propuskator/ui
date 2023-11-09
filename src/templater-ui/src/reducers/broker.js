import produce from 'immer';
import {
    CONNECT_BROKER_REQUEST,
    CONNECT_BROKER_SUCCESS,
    CONNECT_BROKER_ERROR,
    DISCONNECT_BROKER,
    GET_MQTT_CREDENTIALS_SUCCESS,
    CONNECT_LOST,
    CONNECT_RESTORE,
    NETWORK_STATUS_UPDATE,
    RECONNECT_BROKER_SUCCESS
}              from '../constants/actions/broker';
import {
    LOGOUT,
    LOGIN_ERROR
}              from '../constants/actions/sessions';

const initialState = {
    isConnected         : false,
    isLoading           : true,
    isInternetReachable : true,
    brokerUrl           : '',
    credentials         : null
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_MQTT_CREDENTIALS_SUCCESS: {
            draft.credentials = payload?.data || null;
            break;
        }
        case CONNECT_BROKER_REQUEST: {
            draft.isLoading = true;
            break;
        }
        case CONNECT_BROKER_SUCCESS: {
            draft.isConnected = true;
            draft.brokerUrl = payload.brokerUrl;
            draft.isLoading = false;
            break;
        }
        case CONNECT_BROKER_ERROR: {
            draft.isConnected = false;
            draft.isLoading = false;
            break;
        }

        case NETWORK_STATUS_UPDATE: {
            draft.isInternetReachable = payload.isInternetReachable;
            break;
        }

        case CONNECT_LOST: {
            draft.isConnected = false;
            break;
        }

        case CONNECT_RESTORE: {
            draft.isConnected = true;
            break;
        }

        case RECONNECT_BROKER_SUCCESS: {
            draft.isConnected = true;
            draft.isLoading = false;
            draft.brokerUrl = payload.brokerUrl;
            break;
        }

        case LOGOUT:
        case LOGIN_ERROR:
        case DISCONNECT_BROKER: {
            return initialState;
        }
        default:
            break;
    }
}, initialState);

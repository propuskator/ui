import smartHome       from 'SmartHome';
import api             from 'ApiSingleton';
import config          from 'Config';
import store           from 'Store';
import {
    isBrokerConnectedSelector,
    isInternetConnectedSelector,
    isConnectionLoading
}                      from 'Selectors/broker';
import {
    logout
}                      from 'Actions/sessions';
import {
    addToast,
    removeToastByKey
}                      from 'Actions/toasts';
import {
    getDevices
}                      from 'Actions/devices';
import { TOASTS_KEYS } from 'Constants/toasts';
import i18n            from 'I18next';

export const CONNECT_BROKER_REQUEST     = 'CONNECT_BROKER_REQUEST';
export const CONNECT_BROKER_SUCCESS     = 'CONNECT_BROKER_SUCCESS';
export const CONNECT_BROKER_ERROR       = 'CONNECT_BROKER_ERROR';
export const DISCONNECT_BROKER          = 'DISCONNECT_BROKER';
export const NETWORK_STATUS_UPDATE      = 'NETWORK_STATUS_UPDATE';
export const CONNECT_LOST               = 'CONNECT_LOST';
export const CONNECT_RESTORE            = 'CONNECT_RESTORE';
export const RECONNECT_BROKER_SUCCESS   = 'RECONNECT_BROKER_SUCCESS';
export const DISCONNECT_MESSAGE_TIMEOUT = 2 * 1000;     // eslint-disable-line no-magic-numbers

let notificationTimeout = null;

function fetchDataOnBrokerConnect() {
    store.dispatch(getDevices());
}

export function displayConnectionNotification() {
    return async (dispatch, getState) => {
        if (notificationTimeout) clearTimeout(notificationTimeout);

        notificationTimeout = setTimeout(() => {
            const state               = getState();
            const isInternetConnected = isInternetConnectedSelector(state);
            const isBrokerConnected   = isBrokerConnectedSelector(state);
            const isLoading           = isConnectionLoading(state);

            const shouldBrokerConnectionBeDisplayed = !isBrokerConnected && !isLoading;

            if (!isInternetConnected) {
                // return dispatch(addToast({ type: 'error', title: 'Error', message: 'No internet connection' }));
                return;
            }

            if (shouldBrokerConnectionBeDisplayed) {
                return dispatch(addToast({
                    type             : 'error',
                    key              : TOASTS_KEYS.brokerConnectionLost,
                    title            : i18n.t('toasts:Error'),
                    message          : i18n.t('toasts:Broker connection lost'),
                    hideByTimeout    : false,
                    withCloseAbility : false
                }));
            }

            return dispatch(removeToastByKey(TOASTS_KEYS.brokerConnectionLost));
        }, DISCONNECT_MESSAGE_TIMEOUT);
    };
}

export function networkStatusUpdate({ isInternetReachable }) {
    return async (dispatch) => {
        await dispatch({
            type    : NETWORK_STATUS_UPDATE,
            payload : {
                isInternetReachable
            }
        });

        dispatch(displayConnectionNotification());
    };
}

export function handleBrokerConnectionLost() {
    return async (dispatch) => {
        await dispatch({ type: CONNECT_LOST });

        dispatch(displayConnectionNotification());
    };
}

export function handleBrokerConnectionRestored() {
    return async dispatch => {
        await dispatch({ type: CONNECT_RESTORE });

        dispatch(displayConnectionNotification());
    };
}


export const GET_MQTT_CREDENTIALS_REQUEST = 'GET_MQTT_CREDENTIALS_REQUEST';
export const GET_MQTT_CREDENTIALS_SUCCESS = 'GET_MQTT_CREDENTIALS_SUCCESS';

export function getMqttCredentials({ onError } = {}) {
    return async dispatch => {
        try {
            dispatch({ type: GET_MQTT_CREDENTIALS_REQUEST });

            const { data } = await api.broker.getMqttCredentials();

            dispatch({
                type    : GET_MQTT_CREDENTIALS_SUCCESS,
                payload : { data }
            });

            return data;
        } catch (error) {
            if (error.code === 'WRONG_TOKEN') dispatch(logout());

            if (onError) onError(error);
        }
    };
}

function getConnectionParams(mqttCredentials) {
    if (!mqttCredentials) return mqttCredentials;

    return {
        brokerUrl : config?.brokerUrl || '',
        login     : mqttCredentials?.username || '',
        password  : mqttCredentials?.password || '',
        rootTopic : mqttCredentials?.rootTopic || ''
    };
}

export function connectBroker({ data, onError } = {}) {
    return async dispatch => {
        try {
            dispatch({ type: CONNECT_BROKER_REQUEST });

            let connectionParams = data;

            if (!connectionParams) {
                const mqttCredentials = await dispatch(getMqttCredentials({ onError }));

                connectionParams = getConnectionParams(mqttCredentials);
            }

            const result = await smartHome.connect(connectionParams, onError);

            dispatch({
                type    : CONNECT_BROKER_SUCCESS,
                payload : {
                    brokerUrl   : connectionParams.brokerUrl,
                    isConnected : true
                }
            });

            fetchDataOnBrokerConnect();

            return result;
        } catch (error) {
            dispatch({ type: CONNECT_BROKER_ERROR });

            throw (error);
        }
    };
}

export function disconnectBroker() {
    return async dispatch => {
        try {
            smartHome.disconnect();

            dispatch({ type: DISCONNECT_BROKER });
        } catch (error) {
            console.log('Disconnect error', error);
        }
    };
}

export function reconnectBroker(onError) {
    return async dispatch => {
        try {
            const mqttCredentials  = await dispatch(getMqttCredentials({ onError }));
            const connectionParams = getConnectionParams(mqttCredentials);

            await smartHome.reconnect(connectionParams, onError);

            dispatch({
                type    : RECONNECT_BROKER_SUCCESS,
                payload : {
                    brokerUrl : connectionParams.brokerUrl
                }
            });
            fetchDataOnBrokerConnect();
        } catch (error) {
            console.log('Reconnect error', error);
        }
    };
}

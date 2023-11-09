import { TOASTS_KEYS } from '../../constants/toasts';
import {
    NETWORK_STATUS_UPDATE,
    DISCONNECT_MESSAGE_TIMEOUT,
    CONNECT_LOST,
    CONNECT_RESTORE,
    CONNECT_BROKER_REQUEST,
    GET_MQTT_CREDENTIALS_REQUEST,
    GET_MQTT_CREDENTIALS_SUCCESS,
    CONNECT_BROKER_SUCCESS,
    CONNECT_BROKER_ERROR,
    DISCONNECT_BROKER,
    RECONNECT_BROKER_SUCCESS
}                      from '../../constants/actions/broker';
import {
    isBrokerConnectedSelector,
    isInternetConnectedSelector,
    isConnectionLoadingSelector,
    brokerCredentialsSelector
}                      from '../../selectors/broker';
import ActionsBase     from './../base';

let notificationTimeout = null;

function getConnectionParams(mqttCredentials) {
    if (!mqttCredentials) return mqttCredentials;

    return {
        brokerUrl : mqttCredentials?.sandbox_url_wss || '',
        login     : mqttCredentials?.username || '',
        password  : mqttCredentials?.password || '',
        rootTopic : mqttCredentials?.username || ''
    };
}
export default class Broker extends ActionsBase {
    constructor(...args) {
        super(...args);

        this.displayConnectionNotification  = this.displayConnectionNotification.bind(this);
        this.networkStatusUpdate            = this.networkStatusUpdate.bind(this);
        this.handleBrokerConnectionLost     = this.handleBrokerConnectionLost.bind(this);
        this.handleBrokerConnectionRestored = this.handleBrokerConnectionRestored.bind(this);
        this.getMqttCredentials             = this.getMqttCredentials.bind(this);
        this.connectBroker                  = this.connectBroker.bind(this);
        this.disconnectBroker               = this.disconnectBroker.bind(this);
        this.reconnectBroker                = this.reconnectBroker.bind(this);
        this.getConnectionParams            = getConnectionParams;

        this.fetchDataOnBrokerConnect = () => {};
        this.logout                   = () => {};
        this.addToast                 = () => {};
        this.removeToastByKey         = () => {};
        this.smartHome                = void 0;
    }

    displayConnectionNotification() {
        return async (dispatch, getState) => {
            if (notificationTimeout) clearTimeout(notificationTimeout);

            notificationTimeout = setTimeout(() => {
                const state               = getState();
                const isInternetConnected = isInternetConnectedSelector(state);
                const isBrokerConnected   = isBrokerConnectedSelector(state);
                const isLoading           = isConnectionLoadingSelector(state);

                const shouldBrokerConnectionBeDisplayed = !isBrokerConnected && !isLoading;

                if (!isInternetConnected) {
                    // return dispatch(addToast({ type: 'error', title: 'Error', message: 'No internet connection' }));
                    return;
                }

                if (shouldBrokerConnectionBeDisplayed) {
                    return dispatch(this.addToast({
                        type             : 'error',
                        key              : TOASTS_KEYS.brokerConnectionLost,
                        title            : 'Error',
                        message          : 'Broker connection lost',
                        hideByTimeout    : false,
                        withCloseAbility : false
                    }));
                }

                return dispatch(this.removeToastByKey(TOASTS_KEYS.brokerConnectionLost));
            }, DISCONNECT_MESSAGE_TIMEOUT);
        };
    }

    networkStatusUpdate({ isInternetReachable }) {
        return async (dispatch) => {
            await dispatch({
                type    : NETWORK_STATUS_UPDATE,
                payload : {
                    isInternetReachable
                }
            });

            dispatch(this.displayConnectionNotification());
        };
    }

    handleBrokerConnectionLost() {
        return async (dispatch) => {
            await dispatch({ type: CONNECT_LOST });

            dispatch(this.displayConnectionNotification());
        };
    }

    handleBrokerConnectionRestored() {
        return async dispatch => {
            await dispatch({ type: CONNECT_RESTORE });

            dispatch(this.displayConnectionNotification());
        };
    }

    getMqttCredentials({ onError } = {}) {
        return async (dispatch, getState) => {
            try {
                const state = getState();
                const credentials = brokerCredentialsSelector(state);

                if (credentials) return credentials;

                dispatch({ type: GET_MQTT_CREDENTIALS_REQUEST });

                const response = await this.api.accountSettings.getData();

                dispatch({
                    type    : GET_MQTT_CREDENTIALS_SUCCESS,
                    payload : { data: response?.mqttCredentials }
                });

                return credentials;
            } catch (error) {
                if (error.code === 'WRONG_TOKEN') dispatch(this.logout());

                if (onError) onError(error);
            }
        };
    }

    connectBroker({ data, onError, onSuccess } = {}) {
        return async dispatch => {
            try {
                dispatch({ type: CONNECT_BROKER_REQUEST });

                let connectionParams = data;

                if (!connectionParams) {
                    const mqttCredentials = await dispatch(this.getMqttCredentials({ onError }));

                    connectionParams = this.getConnectionParams(mqttCredentials);
                } else {
                    dispatch({
                        type    : GET_MQTT_CREDENTIALS_SUCCESS,
                        payload : { data }
                    });

                    connectionParams = this.getConnectionParams(data);
                }

                if (!this.smartHome) return;

                const result = await this.smartHome.connect(connectionParams, onError);

                dispatch({
                    type    : CONNECT_BROKER_SUCCESS,
                    payload : {
                        brokerUrl   : connectionParams.brokerUrl,
                        isConnected : true
                    }
                });

                if (onSuccess) onSuccess();

                this.fetchDataOnBrokerConnect();

                return result;
            } catch (error) {
                console.log('Connect broker error', { error });
                dispatch({ type: CONNECT_BROKER_ERROR });

                if (onError) onError(error);
            }
        };
    }

    disconnectBroker() {
        return async dispatch => {
            try {
                if (!this.smartHome) return;
                this.smartHome.disconnect();

                dispatch({ type: DISCONNECT_BROKER });
            } catch (error) {
                console.log('Disconnect error', error);
            }
        };
    }

    reconnectBroker({ data, onError } = {}) {
        return async dispatch => {
            try {
                const mqttCredentials  = data || await dispatch(this.getMqttCredentials({ onError }));
                const connectionParams = getConnectionParams(mqttCredentials);

                dispatch({
                    type    : GET_MQTT_CREDENTIALS_SUCCESS,
                    payload : { data }
                });

                if (this.smartHome) {
                    await this.smartHome.reconnect(connectionParams, onError);

                    dispatch({
                        type    : RECONNECT_BROKER_SUCCESS,
                        payload : {
                            brokerUrl : connectionParams.brokerUrl
                        }
                    });

                    this.fetchDataOnBrokerConnect();
                }
            } catch (error) {
                console.log('Reconnect error', error);
            }
        };
    }
}

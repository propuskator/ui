export const isBrokerConnectedSelector   = state => state.broker.isConnected;
export const isInternetConnectedSelector = state => state.broker.isInternetReachable;
export const isConnectionLoading         = state => state.broker.isLoading;
export const brokerCredentialsSelector   = state => state.broker.credentials;

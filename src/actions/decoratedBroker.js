import store from 'Store';
import {
    handleBrokerConnectionRestored,
    handleBrokerConnectionLost
}            from 'Actions/broker';


export function dispatchBrokerConnectionLost() {
    store.dispatch(handleBrokerConnectionLost());
}

export function dispatchBrokerConnectionRestore() {
    store.dispatch(handleBrokerConnectionRestored());
}

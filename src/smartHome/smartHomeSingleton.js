// import MQTTTransport                       from 'homie-sdk/lib/Broker/mqtt';
// import Homie                               from 'homie-sdk/lib/homie/Homie';
// import HomieClient                         from 'homie-sdk/lib/homie/HomieClient';
// import {
//     decoratedCallToastNotification as handleOffline,
//     decoratedHideToastNotification as handleConnect
// }                                          from '../actions/interface';
// import {
//     dispatchHandleHardwareDelete as handleHardwareDelete
//     // decoratedHandleAddNewBridgeEntity as handleAddNewBridgeEntity,
//     // decoratedHandleAddNewGroupEntity as handleAddNewGroupEntity,
//     // decoratedHandleDiscoveryDeleted as handleDiscoveryDelete,
//     // decoratedHandleDiscoveryAccepted as handleDiscoveryAccepte,
//     // decoratedAddNewDiscovery as handleAddNewDiscovery,
//     // decoratedHandleAddNewBridgeTypeEntity as handleAddNewBridgeTypeEntity,
//     // decoratedHandleAddNewNotificationChannel as handleAddNewNotificationChannel,
//     // decoratedHandleSystemUpdates as handleSystemUpdates,
//     // decoratedHandleAddNewAlias as handleAddNewAlias
// }                                          from 'Actions/decoratedHomie';
import {
    addNewNode as handleAddNewNode,
    addNewSensor as handleAddNewSensor,
    addNewDeviceTelemetry as handleAddNewDeviceTelemetry,
    addNewDeviceOption as handleAddNewDeviceOption,
    addNewNodeTelemetry as handleAddNewNodeTelemetry,
    addNewNodeOption as handleAddNewNodeOption
}                                             from 'Actions/homieHandlers';
import { addNewDevice as handleAddNewDevice } from 'Actions/devices';
import {
    dispatchBrokerConnectionLost as handleBrokerConnectionLost,
    dispatchBrokerConnectionRestore as handleBrokerConnectionRestored
}                                             from 'Actions/decoratedBroker';


// import config        from './../../config';

import SmartHome        from './SmartHome';

// let disconnectTimer = null;
// const disconnectTimerInterval = 2000;

// const tlsConf = config.env === 'demo' ? {} : { tls: { enable: true, selfSigned: true } };
// const transport = new MQTTTransport({
//     // uri      : config.brokerUrl,
//     // username : config.mqttUsername,
//     // password : config.mqttPassword,
//     // ...tlsConf
// });

// function processConnect()dispatchBrokerConnectionRestore {
//     clearTimeout(disconnectTimer);
//     // handleConnect();
// }

// function processOffline() {
//     clearTimeout(disconnectTimer);
//     // disconnectTimer = setTimeout(handleOffline, disconnectTimerInterval);
// }

// const homie = new Homie({ transport });

// homie.on('offline', processOffline);
// homie.on('online', processConnect);

// const homieClient = new HomieClient({ homie });


const smartHome = new SmartHome({
    // homieClient
    handleBrokerConnectionLost,
    handleBrokerConnectionRestored,
    handleAddNewDevice,
    handleAddNewNode,
    handleAddNewSensor,
    handleAddNewDeviceTelemetry,
    handleAddNewDeviceOption,
    handleAddNewNodeTelemetry,
    handleAddNewNodeOption
    // handleAddNewNotification,
    // handleAddNewThreshold,
    // handleHardwareDelete
    // handleAddNewBridgeEntity,
    // handleAddNewGroupEntity,
    // handleDiscoveryAccepte,
    // handleDiscoveryDelete,
    // handleAddNewDiscovery,
    // handleAddNewBridgeTypeEntity,
    // handleAddNewNotificationChannel,
    // handleSystemUpdates,
    // handleAddNewAlias
});

export default smartHome;

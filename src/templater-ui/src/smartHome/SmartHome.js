import MQTTTransport from 'homie-sdk/lib/Broker/mqtt';
import Homie         from 'homie-sdk/lib/homie/Homie';
import HomieClient   from 'homie-sdk/lib/homie/HomieClient';
import HomieMigrator from 'homie-sdk/lib/homie/HomieMigrator';

import config        from '../config';

class SmartHome {
    constructor({
        sessionPrefix = 'propuskator',
        handleBrokerConnectionLost,
        handleBrokerConnectionRestored,
        handleAddNewDevice,
        handleAddNewNode,
        handleAddNewSensor,
        handleAddNewDeviceTelemetry,
        handleAddNewDeviceOption,
        handleAddNewNodeTelemetry,
        handleAddNewNodeOption,
        handleHardwareDelete
    }) {
        this.handleBrokerConnectionLost = handleBrokerConnectionLost;
        this.handleBrokerConnectionRestored = handleBrokerConnectionRestored;
        this.handleAddNewDevice = handleAddNewDevice;
        this.handleAddNewNode = handleAddNewNode;
        this.handleAddNewSensor = handleAddNewSensor;
        this.handleAddNewDeviceTelemetry = handleAddNewDeviceTelemetry;
        this.handleAddNewDeviceOption = handleAddNewDeviceOption;
        this.handleAddNewNodeTelemetry = handleAddNewNodeTelemetry;
        this.handleAddNewNodeOption = handleAddNewNodeOption;
        this.handleHardwareDelete = handleHardwareDelete;

        this.isRunning = false;
        this.defferedFunctions = [];
        this.sessionPrefix = sessionPrefix;
    }

    setHandlers({
        handleBrokerConnectionLost,
        handleBrokerConnectionRestored
    }) {
        if (handleBrokerConnectionLost) this.handleBrokerConnectionLost = handleBrokerConnectionLost;
        if (handleBrokerConnectionRestored) this.handleBrokerConnectionRestored = handleBrokerConnectionRestored;
    }

    async connect({ brokerUrl, login, password, rootTopic }, onError) {
        const tlsConf = config.env === 'demo' || true ? {} : { tls: { enable: true, selfSigned: true } };   // eslint-disable-line no-constant-condition
        const transport = new MQTTTransport({
            session  : `session-${this.sessionPrefix}_${Math.random().toString(16).substr(2, 8)}`,  // eslint-disable-line no-magic-numbers
            uri      : brokerUrl,
            username : login,
            password,
            rootTopic,
            ...tlsConf
        });

        this.homie = new Homie({ transport });

        this.homie.on('offline', this.handleBrokerConnectionLost);
        this.homie.on('online', this.handleBrokerConnectionRestored);
        this.homie.on('error', error => {
            console.error('HOMMIE ERROR', error);

            if (error.message === 'Connection refused: Not authorized') {
                this.homie.transport.end();
                if (onError) onError(error);
            }
        });

        this.migrator = new HomieMigrator({ homie: this.homie });

        const homieClient = new HomieClient({ homie: this.homie });

        this.homieClient = homieClient;

        await this.init();
    }

    async reconnect(params, onError) {
        if (this.homie) this.disconnect();

        return this.connect(params, onError);
    }

    async init() {
        try {
            await this.homieClient.initWorld();
            this.isRunning = true;
            this.defferedFunctions.forEach(({ resolve, getResult }) => resolve(getResult()));

            this.onNewDeviceAdded();
            this.onNewNodeAdded();
            this.onNewSensorAdded();
            this.onNewDeviceTelemetryAdded();
            this.onNewDeviceOptionAdded();
            this.onNewNodeTelemetryAdded();
            this.onNewNodeOptionAdded();
            this.onDelete();
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    disconnect() {
        this.homie.transport.end();
    }

    publish(topic, value) {
        return this.homieClient.homie.publishToBroker(`${topic}/set`, value);
    }

    getDeviceById(id) {
        try {
            return this.homieClient.getDeviceById(id);
        } catch (error) {
            console.log('Get device error', { error });
        }
    }

    getDevices() {
        return new Promise((resolve) => {
            const getResult = () => this.homieClient.getDevices();

            if (!this.isRunning) {
                this.defferedFunctions.push({ resolve, getResult });
            } else {
                resolve(getResult());
            }
        });
    }

    // deleteDevice(deviceId) {
    //     const device = this.homieClient.getDeviceById(deviceId);

    //     if (!device) return;

    //     this.migrator.deleteDevice(device);
    // }

    getInstanceByTopic(topic) {
        return this?.homieClient?.getInstanceByTopic(topic);
    }

    onNewDeviceAdded() {
        this.homieClient.onNewDeviceAdded(({ deviceId }) => {
            const newDevice = this.homieClient.getDeviceById(deviceId);

            if (!newDevice) return;

            this.handleAddNewDevice(newDevice);
        });
    }

    onNewNodeAdded() {
        this.homieClient.onNewNodeAdded(({ deviceId, nodeId }) => {
            const device = this.homieClient.getDeviceById(deviceId);

            if (!device) return;

            const newNode = device.getNodeById(nodeId);

            this.handleAddNewNode(newNode);
        });
    }

    onNewSensorAdded() {
        this.homieClient.onNewSensorAdded(({ deviceId, nodeId, sensorId }) => {
            const device = this.homieClient.getDeviceById(deviceId);

            if (!device) return;

            const node = device.getNodeById(nodeId);
            const newSensor = node.getSensorById(sensorId);

            this.handleAddNewSensor(newSensor);
        });
    }

    onNewDeviceTelemetryAdded() {
        this.homieClient.onNewDeviceTelemetryAdded(({ deviceId, telemetryId }) => {
            const device = this.homieClient.getDeviceById(deviceId);

            if (!device) return;

            const newTelemetry = device.getTelemetryById(telemetryId);

            this.handleAddNewDeviceTelemetry(newTelemetry);
        });
    }

    onNewDeviceOptionAdded() {
        this.homieClient.onNewDeviceOptionAdded(({ deviceId, optionId }) => {
            const device = this.homieClient.getDeviceById(deviceId);

            if (!device) return;

            const newOption = device.getOptionById(optionId);

            this.handleAddNewDeviceOption(newOption);
        });
    }

    onNewNodeTelemetryAdded() {
        this.homieClient.onNewNodeTelemetryAdded(({ deviceId, nodeId, telemetryId }) => {
            const device = this.homieClient.getDeviceById(deviceId);

            if (!device) return;

            const node = device.getNodeById(nodeId);
            const newTelemetry = node.getTelemetryById(telemetryId);

            this.handleAddNewNodeTelemetry(newTelemetry);
        });
    }

    onNewNodeOptionAdded() {
        this.homieClient.onNewNodeOptionAdded(({ deviceId, nodeId, optionId }) => {
            const device = this.homieClient.getDeviceById(deviceId);

            if (!device) return;

            const node = device.getNodeById(nodeId);
            const newOption = node.getOptionById(optionId);

            this.handleAddNewNodeOption(newOption);
        });
    }

    onDelete() {
        this.homieClient.onDelete((data) => {
            this.handleHardwareDelete(data);
        });
    }

    deleteDevice(deviceId) {
        const device = this.getDeviceById(deviceId);

        if (!device) return;

        device.deleteRequest();
    }
}

export default SmartHome;

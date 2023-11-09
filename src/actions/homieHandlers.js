import {
    eventCache
    // handlePublishEvent
    // handleErrorPublish
} from './homie';

export function addNewNode(node) {
    const deviceId   = node.getDeviceId();
    const serialized = node.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'NODE', deviceId, item: serialized }
    });
}

export function addNewSensor(sensor) {
    const deviceId   = sensor.getDeviceId();
    const nodeId     = sensor.getNodeId();
    const serialized = sensor.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'SENSOR', deviceId, nodeId, item: serialized }
    });
}

export function addNewDeviceTelemetry(telemetry) {
    const deviceId   = telemetry.getDeviceId();
    const serialized = telemetry.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'DEVICE_TELEMETRY', deviceId, item: serialized }
    });
}

export function addNewDeviceOption(option) {
    const deviceId   = option.getDeviceId();
    const serialized = option.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'DEVICE_OPTION', deviceId, item: serialized }
    });
}

export function addNewNodeTelemetry(telemetry) {
    const deviceId   = telemetry.getDeviceId();
    const nodeId     = telemetry.getNodeId();
    const serialized = telemetry.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'NODE_TELEMETRY', deviceId, nodeId, item: serialized }
    });
}

export function addNewNodeOption(option) {
    const deviceId   = option.getDeviceId();
    const nodeId     = option.getNodeId();
    const serialized = option.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'NODE_OPTION', deviceId, nodeId, item: serialized }
    });
}

// export function addNewThreshold(threshold) {
//     threshold.onAttributePublish(handlePublishEvent);

//     const scenarioId = threshold.getScenarioId();
//     const serialized = threshold.serialize();

//     eventCache.push({
//         type : 'ADD_EVENT',
//         data : { type: 'THRESHOLD', scenarioId, item: serialized }
//     });
// }

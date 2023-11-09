/* eslint-disable more/no-duplicated-chains */
/* eslint-disable max-len */
import EventCache from 'templater-ui/src/utils/homie/EventCache';

import config     from 'Config';
import smartHome  from 'SmartHome';
import store      from 'Store';

export const UPDATE_ATTRIBUTE_BY_TOPIC_START   = 'UPDATE_ATTRIBUTE_BY_TOPIC_START';
export const UPDATE_ATTRIBUTE_BY_TOPIC_SUCCESS = 'UPDATE_ATTRIBUTE_BY_TOPIC_SUCCESS';
export const UPDATE_ATTRIBUTE_BY_TOPIC_ERROR   = 'UPDATE_ATTRIBUTE_BY_TOPIC_ERROR';
export const UPDATE_HOMIE_STATE                = 'UPDATE_HOMIE_STATE';

export const eventCache = new EventCache({
    debounceTime : 100,
    cacheSize    : +config.mqttCacheLimit,
    handler      : updateSchema => store.dispatch(updateHomieState(updateSchema))
});

export function handlePublishEvent(instance) {
    const { field, value, type = '', device = null,  node = null, property = null /* , threshold = null */ } = instance;
    const ENTITY_BY_TYPE = {
        DEVICE           : device,
        NODE             : node,
        SENSOR           : property,
        DEVICE_OPTION    : property,
        DEVICE_TELEMETRY : property,
        NODE_OPTION      : property,
        NODE_TELEMETRY   : property
    };
    const entity = ENTITY_BY_TYPE[type];
    const topic = entity ? entity.getTopic() : null;

    let deviceId;
    let nodeId = null;
    let propertyId = null;

    switch (type) {     // eslint-disable-line default-case
        case 'DEVICE':
            deviceId = device.getId();
            break;
        case 'NODE':
            deviceId = device.getId();
            nodeId = node.getId();
            break;
        case 'DEVICE_TELEMETRY':
        case 'DEVICE_OPTION':
        case 'NODE_SETTING':
            deviceId = device.getId();
            propertyId = property.getId();
            break;
        case 'SENSOR':
        case 'NODE_TELEMETRY':
        case 'NODE_OPTION':
            deviceId = device.getId();
            nodeId = node.getId();
            propertyId = property.getId();
            break;
        // case 'THRESHOLD': {
        //     const scenarioId = threshold.getScenarioId();
        //     const thresholdId = threshold.getId();

        //     deviceId = 'threshold';
        //     nodeId     = scenarioId;
        //     propertyId = thresholdId;
        //     break;
        // }
    }
    eventCache.push({
        type : 'UPDATE_EVENT',
        data : { field, value, type, deviceId, nodeId, propertyId, topic }
    });
}


export function setAttribute({ topic, field, value, onError, onSuccess }) {
    return async dispatch => {
        try {
            dispatch({
                type    : UPDATE_ATTRIBUTE_BY_TOPIC_START,
                payload : { topic }
            });

            const { instance } = smartHome.getInstanceByTopic(topic);
            const res = await instance.setAttribute(field, value);

            dispatch({
                type    : UPDATE_ATTRIBUTE_BY_TOPIC_SUCCESS,
                payload : { topic }
            });

            if (onSuccess) onSuccess();

            return res;
        } catch (error) {
            console.error('Set attribute error: ', error);
            if (onError) onError(error);

            dispatch({
                type    : UPDATE_ATTRIBUTE_BY_TOPIC_ERROR,
                payload : { topic }
            });
        }
    };
}

function updateHomieState(updateSchema) {
    return dispatch => {
        dispatch({
            type    : UPDATE_HOMIE_STATE,
            payload : { updateSchema }
        });
    };
}

export function patchSubjectArray(draftSubject, patchArray, propertyType) {
    if (!patchArray?.length) return;

    for (const patchProperty of patchArray) {
        if (!draftSubject[propertyType]) draftSubject[propertyType] = [];

        const draftSubjectProperty = draftSubject[propertyType].find(({ id }) => id === patchProperty.id);

        if (draftSubjectProperty) {
            Object.assign(draftSubjectProperty, patchProperty);
        } else {
            draftSubject[propertyType].push(patchProperty);
        }
    }
}

export function patchNodesArray(draftDevice, patchNodes) {
    if (!patchNodes?.length) return;

    for (const patchNode of patchNodes) {
        if (!draftDevice.nodes) draftDevice.nodes = [];

        const draftNode = draftDevice.nodes.find(({ id }) => id === patchNode.id);

        if (draftNode) {
            const {
                sensors   : patchNodeSensors,
                options   : patchNodeOptions,
                telemetry : patchNodeTelemetries,
                ...patchNodeAttributes
            } = patchNode;

            Object.assign(draftNode, patchNodeAttributes);

            patchSubjectArray(draftNode, patchNodeSensors, 'sensors');
            patchSubjectArray(draftNode, patchNodeOptions, 'options');
            patchSubjectArray(draftNode, patchNodeTelemetries, 'telemetry');
        } else {
            draftDevice.nodes.push(patchNode);
        }
    }
}

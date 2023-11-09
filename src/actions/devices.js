import smartHome                    from 'SmartHome';

import {
    eventCache,
    handlePublishEvent,
    setAttribute
}                                   from 'Actions/homie';

export const GET_DEVICES = 'GET_DEVICES';

export function getDevices() {
    return async dispatch => {
        try {
            const devices = await smartHome.getDevices();
            const serializedDevices = {};

            for (const key in devices) {
                if (devices.hasOwnProperty(key)) {
                    const device = devices[key];

                    device.onAttributePublish(handlePublishEvent);
                    // device.onErrorPublish(handleErrorPublish);
                    serializedDevices[key] = device.serialize();
                }
            }

            dispatch({
                type    : GET_DEVICES,
                payload : {
                    devices : serializedDevices
                }
            });
        } catch (error) {
            console.error('Get devices error', error);
        }
    };
}

export function addNewDevice(device) {
    device.onAttributePublish(handlePublishEvent);

    const serialized = device.serialize();

    eventCache.push({
        type : 'ADD_EVENT',
        data : { type: 'DEVICE', item: serialized }
    });
}

export function setDoorState({
    topic, value,
    onSuccess, onError, onFinally
} = {}) {
    return dispatch => {
        return dispatch(setAttribute({
            topic,
            field : 'value',
            value,
            onSuccess,
            onError,
            onFinally
        }));
    };
}

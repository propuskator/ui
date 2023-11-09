import produce from 'immer';

import {
    GET_DEVICES
}              from 'Actions/devices';
import {
    UPDATE_HOMIE_STATE,
    UPDATE_ATTRIBUTE_BY_TOPIC_START,
    UPDATE_ATTRIBUTE_BY_TOPIC_SUCCESS,
    UPDATE_ATTRIBUTE_BY_TOPIC_ERROR,
    patchNodesArray,
    patchSubjectArray
}              from 'Actions/homie';
import {
    LOGOUT,
    LOGIN_ERROR
}              from 'Actions/sessions';

const initialState = {
    byID             : {},
    processingTopics : []
};

export default produce((draft, action) => {
    const { type, payload } = action;

    switch (type) {
        case GET_DEVICES: {
            draft.byID = payload.devices;
            break;
        }
        case UPDATE_ATTRIBUTE_BY_TOPIC_START: {
            draft.processingTopics.push(payload?.topic);
            break;
        }
        case UPDATE_ATTRIBUTE_BY_TOPIC_ERROR:
        case UPDATE_ATTRIBUTE_BY_TOPIC_SUCCESS: {
            draft.processingTopics = draft.processingTopics.filter(topic => topic !== payload?.topic);
            break;
        }
        case UPDATE_HOMIE_STATE: {
            const { updateSchema } = action.payload;

            for (const deviceId of Object.keys(updateSchema.devices)) {
                if (updateSchema.devices.hasOwnProperty(deviceId)) {
                    const draftDevice = draft.byID[deviceId];
                    const patchDevice = updateSchema.devices[deviceId];

                    if (draftDevice) {
                        const {
                            nodes     : patchNodes,
                            options   : patchOptions,
                            telemetry : patchTelemetries,
                            ...patchDeviceAttributes
                        } = patchDevice;

                        Object.assign(draftDevice, patchDeviceAttributes);

                        patchSubjectArray(draftDevice, patchOptions, 'options');
                        patchSubjectArray(draftDevice, patchTelemetries, 'telemetry');

                        patchNodesArray(draftDevice, patchNodes);
                    } else {
                        draft.byID[deviceId] = patchDevice;
                    }
                }
            }
            const { eventsToRemove } = updateSchema;

            if (eventsToRemove) {
                draft.processingTopics = draft.processingTopics?.filter(topic => {
                    return !eventsToRemove.has(topic);
                });
            }

            pruneDevices(draft.byID);

            break;
        }

        case LOGOUT:
        case LOGIN_ERROR: {
            return initialState;
        }


        default:
            break;
    }
}, initialState);


// Remove devices without id property
function pruneDevices(draftDevices) {
    for (const key of Object.keys(draftDevices)) {
        if (draftDevices.hasOwnProperty(key)) {
            const device = draftDevices[key];

            if (!device.id) {
                delete draftDevices[key];
            }
        }
    }
}

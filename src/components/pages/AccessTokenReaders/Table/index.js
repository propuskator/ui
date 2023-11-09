/* eslint-disable  babel/no-unused-expressions */
import { connect }                  from 'react-redux';

import { openModal, closeModal }    from 'Actions/view';
import { addToast }                 from 'Actions/toasts';
import {
    updateAccessTokenReader,
    fetchAccessTokenReaders,
    deleteAccessTokenReader
}                                   from 'Actions/accessTokenReaders';
import { setDoorState }             from 'Actions/devices';

import Table                        from './Table';

/**
 * ID's are hardcoded
 * Specified in our ESP32 firmware
 */
const NODE_ID = 'd';
const SENSOR_ID = 's';

function mapStateToProps(state, ownProps) {
    const { list = [] } = ownProps;
    const { byID: devicesById = {}, processingTopics = [] } = state?.devices || {};
    const doorStateByReaderCode = {};

    list?.forEach(reader => {
        const { code, name } = reader;
        const deviceData = devicesById[code];

        if (deviceData) {
            const node = deviceData?.nodes.find(({ id }) => id === NODE_ID) || null;
            const sensorData = node ? node?.sensors.find(({ id }) => id === SENSOR_ID) : null;

            if (!sensorData) return;

            doorStateByReaderCode[code] = {
                deviceId     : code,
                readerName   : name,
                topic        : sensorData?.rootTopic,
                isDoorOpen   : sensorData?.value === 'true',
                isProcessing : processingTopics?.includes(sensorData?.rootTopic) || false
            };
        }
    });

    return {
        doorStateByReaderCode
    };
}

const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : updateAccessTokenReader,
    fetchItems : fetchAccessTokenReaders,
    deleteItem : deleteAccessTokenReader,
    addToast,
    setDoorState
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);

import { connect }                     from 'react-redux';

import { addToast }                    from 'Actions/toasts';
import { setDoorState }                from 'Actions/devices';

import { deviceSelector }              from 'Selectors/devices';
import { accessTokenReaderSelector }   from 'Selectors/accessTokenReaders';

import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';
import DeviceSettings                  from './DeviceSettings';

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(DeviceSettings));

function mapStateToProps(state, ownProps) {
    const { entityId, accessTokenReaderId } = ownProps;
    const deviceData = deviceSelector(state, entityId) || {};
    const { options = [], telemetry = [] } = deviceData;

    const { displayedTopics = [] } = accessTokenReaderSelector(state, accessTokenReaderId);
    const firmwareSensors = deviceData?.nodes?.find(node => node.id === 'firmware')?.sensors || [];
    const relayNode = deviceData?.nodes?.find(node => node.id === 'r') || {};

    const visibleSensors = relayNode?.sensors?.filter(item => {
        return item?.id[0] === 's';
    });


    const relaySensors = visibleSensors?.map(item => {
        return { ...item, withCustomComponent: true };
    });

    const relays = relaySensors?.concat(relayNode?.options)?.concat(relayNode?.telemetry);

    return {
        options,
        telemetry,
        firmwareSensors,
        displayedTopics,
        relays
    };
}

const mapDispatchToProps = {
    addToast,
    setDoorState
};

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

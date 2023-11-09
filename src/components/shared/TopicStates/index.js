import { connect }      from 'react-redux';
import smartHome        from 'SmartHome';

import TopicStates      from './TopicStates';


function mapStateToProps(state, ownProps) {
    const { topics = [] } = ownProps;

    const topicsInstances = topics?.map(topic => {
        const { instance }  = smartHome.getInstanceByTopic(topic) || {};

        return instance;
    });

    return {
        topics : topicsInstances
    };
}

export default connect(mapStateToProps, null)(TopicStates);

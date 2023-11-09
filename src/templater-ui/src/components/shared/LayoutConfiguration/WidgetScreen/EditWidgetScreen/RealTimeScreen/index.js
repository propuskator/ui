import { connect }                  from 'react-redux';

import RealTimeScreen               from './RealTimeScreen';


function mapStateToProps(state, ownProps) {
    const { widgetToEdit, smartHome } = ownProps;
    const { topics = [] } = widgetToEdit || {};

    const topicsInstances = topics?.map(topic => smartHome.getInstanceByTopic(topic)?.instance);

    return {
        widgetToEdit : { ...widgetToEdit, topicsInstances }
    };
}

export default connect(mapStateToProps, null)(RealTimeScreen);

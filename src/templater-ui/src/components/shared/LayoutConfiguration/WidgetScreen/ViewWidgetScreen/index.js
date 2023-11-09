import { connect }                  from 'react-redux';

import ViewWidgetScreen             from './ViewWidgetScreen';

function mapStateToProps(state, ownProps) {
    const { smartHome } = ownProps;
    const { instance = {} } = smartHome?.getInstanceByTopic(ownProps?.widgetToShow?.widgetTopic) || {};

    return {
        widgetToShow : { ...ownProps?.widgetToShow, value: instance?.value }
    };
}

export default connect(mapStateToProps, null)(ViewWidgetScreen);

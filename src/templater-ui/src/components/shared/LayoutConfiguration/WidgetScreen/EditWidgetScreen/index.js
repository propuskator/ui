import { connect }                  from 'react-redux';

import { processingTopicsSelector } from '../../../../../selectors/devices';

import EditWidgetScreen             from './EditWidgetScreen';


function mapStateToProps(state, { widgetToEdit }) {
    const { topics = [] } = widgetToEdit || {};

    const processingTopics = processingTopicsSelector(state);
    const isProcessing = topics?.some(topic => processingTopics?.includes(topic));

    return {
        processingTopics,
        isProcessing
    };
}

export default connect(mapStateToProps, null)(EditWidgetScreen);

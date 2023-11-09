import { connect }                     from 'react-redux';

import { processingTopicsSelector }    from '../../../../selectors/devices';

import Widget                          from './Widget';


function mapStateToProps(state, { topics }) {
    const widgetTopic = topics?.[0] || '';
    const processingTopics = processingTopicsSelector(state);
    const isProcessing = widgetTopic ? topics.some(topic =>  processingTopics?.includes(topic)) : false;

    return {
        isProcessing,
        widgetTopic,
        topics : topics?.filter(topic => topic)
    };
}

export default connect(mapStateToProps, null)(Widget);

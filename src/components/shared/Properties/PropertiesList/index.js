import { connect }       from 'react-redux';
import * as HomieActions from 'Actions/homie';

import PropertiesList    from './PropertiesList';


function mapStateToProps(state) {
    return {
        processingTopics : state?.devices?.processingTopics || []
    };
}

const mapDispatchToProps = {
    ...HomieActions
};

export default connect(mapStateToProps, mapDispatchToProps)(PropertiesList);

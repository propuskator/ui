import React       from 'react';
import PropTypes   from 'prop-types';
import classnames  from 'classnames/bind';

import PropertyRow from '../PropertyRow';

import styles      from './PropertiesList.less';


const cx = classnames.bind(styles);

function PropertiesList(props) {
    const {
        properties,
        processingTopics,
        isDisable,
        className
    } = props;

    function renderPropertyRow(property) {
        return (
            <PropertyRow
                {...props}
                {...property}
                key               = {property.id}
                isValueProcessing =  {processingTopics?.includes(property?.rootTopic)}
            />
        );
    }

    const propertiesListCN = cx(styles.PropertiesList, {
        disabled    : isDisable,
        [className] : className
    });

    return (
        <div className={propertiesListCN}>
            <div className={styles.tableWrapper}>
                { properties.map(renderPropertyRow) }
            </div>
        </div>
    );
}

PropertiesList.propTypes = {
    properties       : PropTypes.array,
    // hardwareType : PropTypes.oneOf([ 'device', 'node' ]).isRequired,
    // propertyType : PropTypes.oneOf([ 'options', 'telemetry', 'sensors' ]).isRequired,
    // deviceId     : PropTypes.string.isRequired,
    // nodeId       : PropTypes.string,
    isDisable        : PropTypes.bool,
    className        : PropTypes.string,
    processingTopics : PropTypes.arrayOf(PropTypes.string)
};

PropertiesList.defaultProps = {
    className        : '',
    properties       : [],
    processingTopics : [],
    isDisable        : false
};

export default PropertiesList;

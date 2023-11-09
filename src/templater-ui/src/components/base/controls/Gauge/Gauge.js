import React            from 'react';
import PropTypes        from 'prop-types';
import classNames       from 'classnames/bind';

import ReactSpeedometer from 'react-d3-speedometer';

import { isNumeric }    from '../../../../utils/numbers';

import styles           from './Gauge.less';

const cx = classNames.bind(styles);

function Gauge(props) {
    const {
        value,
        unit,
        min,
        max,
        dataType,
        toFixed,
        maxUnitLength,
        segmentCount,
        segmentColors,
        themeMode
    } = props;

    const minNumber = +min;
    const maxNumber = +max;
    const valueNumber = +value;

    function getUnit() {
        return unit?.length > maxUnitLength ? `${unit.slice(0, maxUnitLength)}...` : unit;
    }

    function roundValue() {
        return dataType === 'float' ? parseFloat(value).toFixed(toFixed) : value;
    }

    function getSegmentsStops() {
        const diff = Math.abs(minNumber - maxNumber);
        const step = diff / segmentCount;

        const segments = [ minNumber ];

        // eslint-disable-next-line no-magic-numbers,more/no-c-like-loops
        for (let i = 1; i <= segmentCount - 1; i++) {
            segments.push(Math.round(minNumber + step * i));
        }

        segments.push(maxNumber);

        return segments;
    }

    // eslint-disable-next-line no-nested-ternary
    const currentValue = valueNumber >= maxNumber ? maxNumber : valueNumber <= minNumber ? minNumber : valueNumber;
    const textValue = isNumeric(currentValue) ? roundValue(currentValue) : '-';

    const gaugeCN = cx(styles.Gauge);

    return (
        <div className={gaugeCN}>
            <ReactSpeedometer
                value              = {+currentValue}
                minValue           = {minNumber}
                maxValue           = {maxNumber}
                currentValueText   = {`${textValue} ${getUnit()}`}
                ringWidth          = {25}
                needleHeightRatio  = {0.55}
                customSegmentStops = {getSegmentsStops()}
                textColor          = {themeMode === 'dark' ? '#FFF' : '#666'}
                segmentColors      = {segmentColors}
                paddingVertical    = {15}
                fluidWidth
                key                = {themeMode}
            />
        </div>
    );
}

Gauge.propTypes = {
    value         : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    unit          : PropTypes.string,
    min           : PropTypes.string,
    max           : PropTypes.string,
    dataType      : PropTypes.oneOf([ 'integer', 'float' ]).isRequired,
    toFixed       : PropTypes.number,
    maxUnitLength : PropTypes.number,
    segmentCount  : PropTypes.number,
    segmentColors : PropTypes.arrayOf(PropTypes.string),
    themeMode     : PropTypes.string
};

Gauge.defaultProps = {
    value         : '',
    unit          : '',
    min           : '',
    max           : '',
    toFixed       : 2,
    maxUnitLength : 7,
    segmentCount  : 6,
    segmentColors : [ '#2ec7c9', '#2ec7c9', '#5ab1ef', '#5ab1ef', '#d87a80', '#d87a80' ],
    themeMode     : ''
};

export default Gauge;

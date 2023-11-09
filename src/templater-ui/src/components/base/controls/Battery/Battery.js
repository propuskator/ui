import React, { useMemo }   from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import CriticalValue        from '../../CriticalValue';
import Tooltip              from '../../Tooltip';

import styles               from './Battery.less';

const cx = classnames.bind(styles);

function Battery(props) {
    const { className, value, advanced, progressSteps, isUnitMeasure, themeMode, t } = props;
    const { unit, max, min } = advanced;

    // eslint-disable-next-line no-magic-numbers
    const percent = Math.min(Math.max(Math.floor((value - min) * 100 / (max - min)), 0), 100);

    const progressStep = useMemo(() => {
        const step = progressSteps.find(level => level.percent >= percent);

        return step ? step : { label: 'Value error', color: '#000', isInvalid: true };
    }, [ percent ]);

    const { progress } = useMemo(() => {
        const color = progressStep?.color;

        return {
            progress : { backgroundColor: color, width: progressStep?.isInvalid ? '0' : `${percent}%` }
        };
    }, [ progressStep, percent ]);

    const BatteryCN = cx(
        styles.Battery,
        {
            [className]           : className,
            [`${themeMode}Theme`] : themeMode,
            invalid               : progressStep?.isInvalid
        }
    );

    return (
        <div className={BatteryCN}>
            <CriticalValue
                className = {styles.value}
                maxWidth  = {'33px'}
                value     = {isUnitMeasure ? value : percent}
            />

            <CriticalValue
                className = {styles.unit}
                maxWidth  = {'20px'}
                value     = {isUnitMeasure ? unit : '%'}
            />

            <Tooltip
                classes = {{ tooltip: styles.tooltip }}
                title   = {t(progressStep?.label)}
            >
                <div className = {styles.battery}>
                    <div
                        className = {styles.progress}
                        style     = {progress}
                    />
                    <div className = {styles.bg} />
                    <div className = {styles.batteryStub} />
                </div>
            </Tooltip>
        </div>
    );
}

Battery.propTypes = {
    className : PropTypes.string,
    value     : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    isUnitMeasure : PropTypes.bool,
    advanced      : PropTypes.shape({
        unit : PropTypes.string,
        max  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        min  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }),
    progressSteps : PropTypes.arrayOf(PropTypes.shape({
        percent : PropTypes.number,
        color   : PropTypes.string,
        label   : PropTypes.string
    })),
    themeMode : PropTypes.string,
    t         : PropTypes.func
};

Battery.defaultProps = {
    className     : '',
    value         : void 0,
    isUnitMeasure : false,
    advanced      : {},
    themeMode     : '',
    progressSteps : [
        { percent: 0, color: '#E80616', label: 'Empty charge' },
        { percent: 24, color: '#E80616', label: 'Low charge' },
        { percent: 49, color: '#FA7B02', label: 'Medium charge' },
        { percent: 74, color: '#fdda64', label: 'Normal charge' },
        { percent: 99, color: '#78C43D', label: 'High charge' },
        { percent: 100, color: '#78C43D', label: 'Full charge' }
    ],
    t : (text) => text
};

export default Battery;

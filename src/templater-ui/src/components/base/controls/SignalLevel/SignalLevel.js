
import React, { useMemo }   from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import CriticalValue        from '../../CriticalValue';
import Tooltip              from '../../Tooltip';

import styles               from './SignalLevel.less';

const cx = classnames.bind(styles);

function SignalLevel(props) {
    const { className, value, advanced, levels, isUnitMeasure, size, t } = props;
    const { unit, max, min } = advanced;

    // eslint-disable-next-line no-magic-numbers
    const percent = Math.floor((value - min) * 100 / (max - min));
    // eslint-disable-next-line no-magic-numbers
    const percentLimited = Math.min(Math.max(percent, 0), 100);

    const { label, index, isInvalid } = useMemo(() => {
        let currentLevel;

        levels.forEach((level, _index) => {
            if (level.percent <= percentLimited) currentLevel = { ...level, index: _index };
        });

        return currentLevel ? currentLevel : { label: 'Value error', isInvalid: true };
    }, [ value, min, max ]);

    const SignalLevelCN = cx(
        styles.SignalLevel,
        {
            [className] : className,
            invalid     : isInvalid
        }
    );

    return (
        <div className={SignalLevelCN}>
            <CriticalValue
                className = {styles.value}
                maxWidth  = {'28px'}
                value     = {isUnitMeasure ? value : percentLimited}
            />

            <CriticalValue
                className = {styles.unit}
                maxWidth  = {'21px'}
                value     = {isUnitMeasure ? unit : '%'}
            />

            <Tooltip
                classes = {{ tooltip: styles.tooltip }}
                title   = {t(label)}
            >
                <div
                    className = {styles.signalLevels}
                >
                    {
                        levels.map((level, currIndex) => (
                            level?.percent > 0 ?
                                <div
                                    className = {cx(styles.level, { [styles.filled]: currIndex <= index })}
                                    style     = {{
                                        height : `${currIndex * size}px`,
                                        width  : `${size}px`
                                    }}
                                    key       = {level?.label}
                                />
                                : null
                        ))
                    }
                </div>
            </Tooltip>
        </div>
    );
}

SignalLevel.propTypes = {
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
    levels : PropTypes.arrayOf(PropTypes.shape({
        percent : PropTypes.number,
        color   : PropTypes.string,
        label   : PropTypes.string
    })),
    size : PropTypes.number,
    t    : PropTypes.func
};

SignalLevel.defaultProps = {
    className     : '',
    value         : void 0,
    isUnitMeasure : false,
    advanced      : {},
    levels        : [
        { percent: 0, label: 'No signal' },
        { percent: 1, label: 'Low signal' },
        { percent: 26, label: 'Medium signal' },
        { percent: 51, label: 'Good signal' },
        { percent: 76, label: 'Excellent signal' }
    ],
    size : 4,
    t    : (text) => text
};

export default SignalLevel;

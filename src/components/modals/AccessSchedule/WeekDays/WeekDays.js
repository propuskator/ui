import React, {
// useState,
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Tooltip                  from 'templater-ui/src/components/base/Tooltip';


import styles                   from './WeekDays.less';

const cx = classnames.bind(styles);

const DAYS_LIST = [ {
    id      : 0,
    label   : 'M',
    tooltip : 'Monday'
}, {
    id      : 1,
    label   : 'Tu',
    tooltip : 'Tuesday'
}, {
    id      : 2,
    label   : 'W',
    tooltip : 'Wednesday'
}, {
    id      : 3,
    label   : 'Th',
    tooltip : 'Thursday'
}, {
    id      : 4,
    label   : 'F',
    tooltip : 'Friday'
}, {
    id      : 5,
    label   : 'St',
    tooltip : 'Saturday'
}, {
    id      : 6,
    label   : 'Su',
    tooltip : 'Sunday'
} ];


function WeekDays(props) {
    const {
        value,
        name,
        onChange,
        isProcessing,
        t
    } = props;

    function handleCellClick(itemId) {
        if (!onChange) return;

        const isSelected = value.includes(itemId);
        const valueToSet = isSelected
            ? value.filter(item => item !== itemId)
            : [ ...value, itemId ];

        onChange({ name, value: valueToSet });
    }

    const weekDaysCN = cx(styles.WeekDays, {
        processing : isProcessing
    });

    return (
        <div className={weekDaysCN}>
            { DAYS_LIST.map(dayData => (
                <Tooltip title={t(`schedules-page:${dayData.tooltip}`)} key={dayData.id}>
                    <button
                        type      = 'button'
                        className = {cx(styles.dayCell, 'abort-submit', {
                            selected : value.includes(dayData.id),
                            light    : [ 5, 6 ].includes(dayData.id) // eslint-disable-line no-magic-numbers, max-len
                        })}
                        onClick   = {() => handleCellClick(dayData.id)} // eslint-disable-line react/jsx-no-bind, max-len
                    >

                        { t(`schedules-page:${dayData.label}`) }
                    </button>
                </Tooltip>
            ))}
        </div>
    );
}

WeekDays.propTypes = {
    name         : PropTypes.string,
    value        : PropTypes.array,
    onChange     : PropTypes.func,
    isProcessing : PropTypes.bool,
    t            : PropTypes.func.isRequired
};

WeekDays.defaultProps = {
    name         : '',
    value        : [],
    onChange     : void 0,
    isProcessing : false
};

export default React.memo(WeekDays);

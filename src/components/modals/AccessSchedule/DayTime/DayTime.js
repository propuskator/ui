import React, {
    useEffect,
    useState
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import InputNumber              from 'Base/Input/InputNumber';

import styles                   from './DayTime.less';

const cx = classnames.bind(styles);

function DayTime(props) {
    const {
        value,
        name,
        onChange,
        autoFocus,
        isProcessing
    } = props;
    const [ hours, setHours ] = useState(() => {
        const valueParts = value.split(':');

        if (valueParts?.length === 2) return valueParts[0] || '';   // eslint-disable-line no-magic-numbers

        return '';
    });
    const [ minutes, setMinutes ] = useState(() => {
        const valueParts = value.split(':');

        if (valueParts?.length === 2) return valueParts[1] || '';   // eslint-disable-line no-magic-numbers

        return '';
    });

    useEffect(() => {
        onChange({ name, value: `${hours}:${minutes}` });
    }, [ hours, minutes ]);

    function handleChangeValue({ name, value }) {  // eslint-disable-line  no-shadow
        let processValue = value;
        const isNumber = Number.isInteger(+processValue);

        if (name === 'hours') {
            const MAX_HOURS = 23;

            if (isNumber && +processValue > MAX_HOURS) processValue = MAX_HOURS;

            setHours(processValue);
        } else if (name === 'minutes') {
            const MAX_MIN = 59;

            if (isNumber && +processValue > MAX_MIN) processValue = MAX_MIN;

            setMinutes(processValue);
        }
    }

    const dayTimeCN = cx(styles.DayTime, {
    });

    return (
        <div className={dayTimeCN}>
            <div>
                <InputNumber
                    key          = 'hours'
                    name         = 'hours'
                    onChange     = {handleChangeValue}
                    isProcessing = {isProcessing}
                    disabled     = {isProcessing}
                    withError    = {false}
                    placeholder  = '00'
                    value        = {hours}
                    autoFocus    = {autoFocus}
                    maxLength    = {2}
                    isPositive
                    fillWithZero
                />
            </div>
            <div>
                <InputNumber
                    key          = 'minutes'
                    name         = 'minutes'
                    onChange     = {handleChangeValue}
                    isProcessing = {isProcessing}
                    disabled     = {isProcessing}
                    withError    = {false}
                    placeholder  = '00'
                    value        = {minutes}
                    maxLength    = {2}
                    isPositive
                    fillWithZero
                />
            </div>
        </div>
    );
}

DayTime.propTypes = {
    name         : PropTypes.string,
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange     : PropTypes.func,
    autoFocus    : PropTypes.bool,
    isProcessing : PropTypes.bool
};

DayTime.defaultProps = {
    name         : '',
    value        : [],
    onChange     : void 0,
    autoFocus    : false,
    isProcessing : false
};

export default React.memo(DayTime);

import React              from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import { TIMEZONES_LIST } from '../../../../constants/timezones';
import Dropdown           from '../Dropdown';

import styles             from './DropdownTimezone.less';

const cx = classnames.bind(styles);


const OPTIONS = TIMEZONES_LIST
    ?.filter(timezone => timezone?.utc?.length)
    ?.map((item) => ({
        label : item?.text,
        value : item?.text
    }));

function DropdownTimezone(props) {
    const { value, onChange } = props;

    function handleChange({ name, value }) {    // eslint-disable-line no-shadow
        onChange({ name, value });
    }

    const dropdownTimezoneCN = cx(styles.DropdownTimezone, {
        [props?.className] : props?.className
    });

    return (
        <div className={dropdownTimezoneCN}>
            <Dropdown
                {...props}
                onChange  = {handleChange}
                value     = {value}
                options   = {OPTIONS}
                withClear = {false}
                withError = {false}
                filterBySearch
                withSearch
                isRequired
            />
        </div>
    );
}

DropdownTimezone.propTypes = {
    value    : PropTypes.string,
    onChange : PropTypes.func
};

DropdownTimezone.defaultProps = {
    value    : '',
    onChange : void 0
};

export default DropdownTimezone;

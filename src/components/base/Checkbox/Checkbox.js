import React, {

}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Tooltip                  from 'templater-ui/src/components/base/Tooltip';

import styles                   from './Checkbox.less';

const cx = classnames.bind(styles);

function Checkbox(props) {
    const { name, value, onChange, tooltip } = props;

    function handleChange(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        if (!onChange) return;

        onChange({ name, value: !value });
    }

    const checkboxCN = cx('Checkbox', {
        checked : value
    });

    if (tooltip) {
        return (
            <>
                <Tooltip title={tooltip}>
                    <div
                        className = {checkboxCN}
                        onClick   = {handleChange}
                    >
                        <button className={styles.button} />
                    </div>
                </Tooltip>

            </>
        );
    }

    return (
        <div
            className = {checkboxCN}
            onClick   = {handleChange}
        >
            <button className={styles.button} />
        </div>
    );
}


Checkbox.propTypes = {
    value    : PropTypes.bool,
    name     : PropTypes.string,
    onChange : PropTypes.func,
    tooltip  : PropTypes.string
};

Checkbox.defaultProps = {
    value    : false,
    name     : '',
    onChange : void 0,
    tooltip  : ''
};

export default Checkbox;

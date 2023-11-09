import React, {

}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Tooltip                  from './../Tooltip';
import SvgIcon                  from './../SvgIcon';

import styles                   from './Checkbox.less';

const cx = classnames.bind(styles);

function Checkbox(props) {
    const {
        name,
        value,
        onChange,
        tooltip,
        isProcessing,
        isDisabled,
        variant,
        size
    } = props;

    function handleChange(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        if (!onChange || isProcessing || isDisabled) return;

        onChange({ name, value: !value });
    }

    const checkboxCN = cx('Checkbox', {
        checked         : value,
        procesing       : isProcessing,
        disabled        : isDisabled,
        [`size${size}`] : !!size,
        [variant]       : variant
    });

    return (
        <Tooltip title={tooltip} isDisabled={!tooltip}>
            <div
                className = {checkboxCN}
                onClick   = {!isDisabled ? handleChange : void 0}
            >
                <button
                    className = {cx(styles.button, 'abort-submit')}
                    tabIndex  = {!isDisabled ? void 0 : '-1'}
                >
                    { variant === 'squared'
                        ? (
                            <SvgIcon
                                type      = 'successGreen'
                                className = {cx(styles.successIcon, { hidden: !value })}
                            />
                        ) : null
                    }
                </button>
            </div>
        </Tooltip>
    );
}


Checkbox.propTypes = {
    value        : PropTypes.bool,
    isProcessing : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    name         : PropTypes.string,
    variant      : PropTypes.oneOf([ 'squared', 'circle' ]),
    size         : PropTypes.oneOf([ 'M', 'L' ]),
    onChange     : PropTypes.func,
    tooltip      : PropTypes.string
};

Checkbox.defaultProps = {
    value        : false,
    isProcessing : false,
    isDisabled   : false,
    name         : '',
    variant      : 'circle',
    size         : 'XS',
    onChange     : void 0,
    tooltip      : ''
};

export default Checkbox;

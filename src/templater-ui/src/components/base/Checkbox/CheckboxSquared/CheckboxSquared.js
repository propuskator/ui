import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Typography       from '../../Typography';
import Checkbox         from '../Checkbox';

import styles           from './CheckboxSquared.less';

const cx = classnames.bind(styles);

function CheckboxSquared(props) {
    const {
        isProcessing,
        isDisabled,
        className,
        onChange,
        label,
        size
    } = props;

    const checkboxCN = cx('CheckboxSquared', {
        [className] : className,
        processing  : isProcessing
    });

    function handleChange({ name, value } = {}) {
        if (!onChange || isProcessing || isDisabled) return;

        onChange({ name, value });
    }

    return (
        <div className={checkboxCN}>
            <Checkbox
                {...props}
                isProcessing = {false}
                onChange     = {handleChange}
                variant      = 'squared'
                size         = {size}
            >
                Push
            </Checkbox>

            { label
                ? (
                    <Typography variant='headline4' className={styles.label}>
                        {label}
                    </Typography>
                ) : null
            }
        </div>
    );
}

CheckboxSquared.propTypes = {
    isProcessing : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    className    : PropTypes.string,
    label        : PropTypes.string,
    size         : PropTypes.string,
    onChange     : PropTypes.func
};

CheckboxSquared.defaultProps = {
    isProcessing : false,
    isDisabled   : false,
    className    : '',
    label        : '',
    size         : 'L',
    onChange     : void 0
};


export default CheckboxSquared;

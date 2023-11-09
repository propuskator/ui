import React, { useCallback } from 'react';
import PropTypes              from 'prop-types';
import classnames             from 'classnames/bind';

import Button                 from '../../Button';

import styles                 from './TwoWayButton.less';

const cx = classnames.bind(styles);

function TwoWayButton(props) {
    const { className, value, onChange, isDisabled, isSettable, isProcessing } = props;

    const isClickDisabled = isDisabled || !isSettable || isProcessing;

    const handleClick = useCallback(() => {
        if (isClickDisabled) return;
        onChange({ value: !value });
    }, [ onChange, isClickDisabled ]);

    const twoWayButtonCN = cx(styles.TwoWayButton, {
        [className] : className,
        active      : !!value
    });
    // eslint-disable-next-line no-nested-ternary
    const btnColor = value ? 'primary600' : 'darkOrange';

    return (
        <div className={twoWayButtonCN}>
            <Button
                className  = {styles.btn}
                size       = 'XS'
                isLoading  = {isProcessing}
                onClick    = {handleClick}
                color      = {btnColor}
                isDisabled = {isDisabled || !isSettable}
            >
                {value ? 'ON' : 'OFF'}
            </Button>
        </div>
    );
}

TwoWayButton.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.bool.isRequired,
    onChange     : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    isSettable   : PropTypes.bool,
    isDisabled   : PropTypes.bool
};

TwoWayButton.defaultProps = {
    className    : '',
    isProcessing : false,
    isSettable   : false,
    isDisabled   : false
};

export default TwoWayButton;

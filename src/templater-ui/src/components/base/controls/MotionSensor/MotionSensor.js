import React      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import SvgIcon    from '../../SvgIcon';
import Tooltip    from '../../Tooltip';

import styles     from './MotionSensor.less';

const cx = classnames.bind(styles);

function MotionSensor(props) {
    const { className, isActive, isDisabled } = props;

    const motionSensorCN = cx(styles.MotionSensor, {
        [className] : className
    });

    return (
        <Tooltip
            classes = {{ tooltip: styles.tooltip }}
            title   = {isActive ? 'True' : 'False'}
        >
            <div className={motionSensorCN} >
                {isActive
                    ? <SvgIcon
                        type      = 'activeMotionSensor'
                        color     = {isDisabled ? 'greyMedium' : 'darkOrange'}
                        disabled  = {isDisabled}
                    />
                    : <SvgIcon
                        type      = 'inactiveMotionSensor'
                        color     = {isDisabled ? 'greyMedium' : 'primaryGreen'}
                        disabled  = {isDisabled}
                    />
                }
            </div>
        </Tooltip>
    );
}

MotionSensor.propTypes = {
    className  : PropTypes.string,
    isActive   : PropTypes.boolm,
    isDisabled : PropTypes.bool
};

MotionSensor.defaultProps = {
    className  : '',
    isActive   : false,
    isDisabled : false
};

export default MotionSensor;

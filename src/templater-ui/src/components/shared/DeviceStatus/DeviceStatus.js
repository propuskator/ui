import React                     from 'react';
import classnames                from 'classnames/bind';
import PropTypes                 from 'prop-types';

import Tooltip                   from '../../base/Tooltip';

import { getDeviceStatusMeta }   from './utils';
import styles                    from './DeviceStatus.less';

const cx = classnames.bind(styles);

const TOOLTIP_CLASSES = {
    tooltip : styles.tooltip
};

function DeviceStatus(props) {
    const {
        status, withTooltip,
        t, productVersion,
        firmwareVersion, productStatus,
        withIndicator
    } = props;

    const { color, processStatus } = getDeviceStatusMeta({
        status,
        productVersion,
        firmwareVersion,
        productStatus
    });

    const deviceStatusCN = cx(styles.DeviceStatus, {
        withTooltip
    });

    function getTooltipContent() {
        return processStatus;
    }

    const tooltipContent = getTooltipContent();

    return (
        <Tooltip title={t(`product-page:${tooltipContent}`)} classes={TOOLTIP_CLASSES} isDisabled={!withTooltip}>
            <div className = {deviceStatusCN}>
                { withIndicator ? <div
                    className={styles.indicator}
                    style={{ background: color }}
                    key={color} // key is needed to fix bug with color rerender
                />
                    : null }
            </div>
        </Tooltip>
    );
}

DeviceStatus.propTypes = {
    withTooltip : PropTypes.bool,
    status      : PropTypes.oneOf([
        'init', 'ready', 'disconnected', 'sleeping', 'lost', 'alert', ''
    ]),
    t               : PropTypes.func,
    productStatus   : PropTypes.string,
    productVersion  : PropTypes.string,
    firmwareVersion : PropTypes.string,
    withIndicator   : PropTypes.bool
};

DeviceStatus.defaultProps = {
    withTooltip     : true,
    t               : (text) => text,
    productStatus   : '',
    status          : '',
    productVersion  : '',
    firmwareVersion : '',
    withIndicator   : true
};

export default DeviceStatus;

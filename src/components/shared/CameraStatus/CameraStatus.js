import React, {
    memo
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Tooltip          from 'templater-ui/src/components/base/Tooltip';

import {
    formatDate
}                       from 'Utils/date';

import SvgIcon          from 'Base/SvgIcon';

import styles           from './CameraStatus.less';

const cx = classnames.bind(styles);

const COLOR_BY_TYPE = {
    disconnected : 'red',
    ready        : 'green',
    init         : 'yellow'
};
const LABEL_BY_TYPE = {
    disconnected : 'Disconnected',
    ready        : 'Ready',
    init         : 'Init'
};

function CameraStatus(props) {
    const { type, className, lastSuccessStreamAt } = props;
    const color = COLOR_BY_TYPE[type];
    const label = LABEL_BY_TYPE[type];
    const statusCN = cx(styles.CameraStatus, { [className]: className });
    const tooltipTitle = lastSuccessStreamAt
        ? ` -  ${formatDate({ date: lastSuccessStreamAt })}`
        : '';

    return (
        <Tooltip
            title     = {
                <div>
                    {`${label}${tooltipTitle}`}
                </div>
            }
            ariaLabel = 'status'
        >
            <div className={statusCN}>
                {// eslint-disable-next-line react/jsx-no-bind
                    <button className = {styles.button} onClick = {(e) => e.preventDefault()}>
                        <SvgIcon
                            className = {styles.icon}
                            type      = 'status'
                            color     = {color}
                        />
                    </button>
                }
            </div>
        </Tooltip>
    );
}

CameraStatus.propTypes = {
    type : PropTypes.oneOf([
        'disconnected',
        'ready',
        'init'
    ]).isRequired,
    className           : PropTypes.string,
    lastSuccessStreamAt : PropTypes.string
};

CameraStatus.defaultProps = {
    className           : '',
    lastSuccessStreamAt : void 0
};

export default memo(CameraStatus);

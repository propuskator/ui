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

import styles           from './Status.less';

const cx = classnames.bind(styles);

const COLOR_BY_TYPE = {
    DISCONNECTED : 'red',
    ACTIVE       : 'green',
    INACTIVE     : 'yellow'
};
const LABEL_BY_TYPE = {
    DISCONNECTED : 'Not available',
    ACTIVE       : 'Active',
    INACTIVE     : 'Inactive'
};

function Status(props) {
    const { type, className, activeAt, hasUpdates, t } = props;
    const color = COLOR_BY_TYPE[type];
    const label = LABEL_BY_TYPE[type];
    const statusCN = cx(styles.Status, { [className]: className });
    const tooltipTitle = activeAt
        ? ` -  ${formatDate({ date: activeAt })}`
        : '';

    return (
        <Tooltip
            title     = {
                <div>
                    {`${t(label)}${tooltipTitle}`} <br />
                    { type === 'ACTIVE'
                        ? <div>{t('State')}: {!hasUpdates ? t('synchronized') : t('not synchronized')}</div>
                        : null
                    }
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

Status.propTypes = {
    type : PropTypes.oneOf([
        'DISCONNECTED',
        'ACTIVE',
        'INACTIVE'
    ]).isRequired,
    className  : PropTypes.string,
    activeAt   : PropTypes.string,
    hasUpdates : PropTypes.bool,
    t          : PropTypes.func.isRequired
};

Status.defaultProps = {
    className  : '',
    activeAt   : void 0,
    hasUpdates : void 0
};

export default memo(Status);

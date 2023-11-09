import React, {
    memo
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Tooltip          from 'templater-ui/src/components/base/Tooltip';

import SvgIcon          from 'Base/SvgIcon';

import styles           from './Status.less';

const cx = classnames.bind(styles);

function Status(props) {
    const { className, color, title } = props;
    const statusCN = cx(styles.Status, { [className]: className });

    return (
        <Tooltip
            title     = {title}
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
    color : PropTypes.oneOf([
        'red',
        'yellow',
        'green'
    ]).isRequired,
    title     : PropTypes.string.isRequired,
    className : PropTypes.string
};

Status.defaultProps = {
    className : ''
};

export default memo(Status);

import React, { memo }  from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles           from './CircularProgress.less';

const cx = classnames.bind(styles);

function CustomCircularProgress(props) {
    const { className, color, size, ...rest } = props;

    const circularProgressCN = cx(styles.CircularProgress, {
        [className]     : className,
        [color]         : color,
        [`size${size}`] : size
    });

    return (
        <CircularProgress
            /* size      = {15}*/
            thickness = {4}
            className = {circularProgressCN}
            {...rest}
        />
    );
}

CustomCircularProgress.propTypes = {
    className : PropTypes.string,
    color     : PropTypes.oneOf([ 'white', 'greyDark' ]),
    size      : PropTypes.oneOf([ 'XS', 'S', 'Full', '' ])
};

CustomCircularProgress.defaultProps = {
    className : '',
    size      : '',
    color     : void 0
};

export default memo(CustomCircularProgress);

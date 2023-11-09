import React, {
    memo,
    useMemo
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Image            from '../Image';
import SvgIcon          from '../SvgIcon';
import CircularProgress from '../CircularProgress';

import styles           from './Avatar.less';

const cx = classnames.bind(styles);

function Avatar({
    avatarUrl,
    size,
    fullName,
    renderFallback,
    avatarColor,
    className,
    variant,
    loaderColor
}) {
    const [ lastName = '', firstName = '' ] = fullName.split(' ').map(str => str[0]);
    const fallbackWrapperStyle = {
        width     : size,
        height    : size,
        minWidth  : size,
        minHeight : size,
        ...(fullName ? { borderColor: avatarColor } : {})
    };
    const fallbackStyle = {
        ...(fullName ? { color: avatarColor } : {})
    };
    const avatarCN = cx(styles.avatarImage, {
        [className] : className,
        [variant]   : variant
    });

    return (
        <Image
            src               = {avatarUrl ? avatarUrl : ''}
            className         = {avatarCN}
            style             = {useMemo(() => fallbackWrapperStyle, [])}
            FallbackComponent = {renderFallback
                ? renderFallback()
                : useMemo(() => (
                    <div
                        className = {cx(styles.avatarImageWrapper, {
                            [variant]   : variant,
                            [className] : className,
                            fallback    : true
                        })}
                        style     = {fallbackWrapperStyle}
                    >
                        { fullName
                            ? <div className={styles.avatarFallback} style={fallbackStyle}>{`${lastName}${firstName}`}</div>
                            : <SvgIcon type='subjects' className={styles.avatarFallback} />
                        }
                    </div>
                ), [ lastName, firstName ])
            }
            LoaderComponent = {useMemo(() => (
                <div className={styles.loaderWrapper} style = {fallbackWrapperStyle}>
                    <CircularProgress
                        thickness = {3}
                        color     = {loaderColor}
                    />
                </div>
            ), [])}
        />
    );
}

Avatar.propTypes = {
    avatarUrl      : PropTypes.string,
    size           : PropTypes.number,
    fullName       : PropTypes.string,
    avatarColor    : PropTypes.string,
    renderFallback : PropTypes.func,
    className      : PropTypes.string,
    variant        : PropTypes.oneOf([ 'common', 'rounded', 'squared', 'squaredLeft' ]),
    loaderColor    : PropTypes.string
};

Avatar.defaultProps = {
    size           : 26,
    avatarUrl      : '',
    fullName       : '',
    avatarColor    : '',
    renderFallback : void 0,
    className      : '',
    variant        : 'rounded',
    loaderColor    : void 0
};

export default memo(Avatar);

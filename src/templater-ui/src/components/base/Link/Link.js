import React                    from 'react';
import classnames               from 'classnames/bind';
import PropTypes                from 'prop-types';

import styles                   from './Link.less';

const cx = classnames.bind(styles);

function Link(props) {
    const {
        color,
        children,
        className,
        variant,
        onClick,
        isDisabled,
        isHidden,
        isProcessing
    } = props;

    function handleClick(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        if (isDisabled || isHidden || isProcessing || !onClick) return null;

        if (onClick) onClick();
    }

    const linkCN = cx(styles.Link, 'abort-submit', {
        [className] : className,
        [color]     : color,
        processing  : isProcessing,
        hidden      : isHidden,
        [variant]   : variant
    });

    return (
        <button
            className = {linkCN}
            tabIndex  = {isDisabled || isHidden || isProcessing ? '-1' : void 0}
            onClick   = {handleClick}
        >
            {children}
        </button>
    );
}

Link.propTypes = {
    color : PropTypes.oneOf([
        'grey',
        'primary',
        'primaryGreen',
        'orange'
    ]),
    variant : PropTypes.oneOf([
        'normal',
        'underline',
        'withoutUnderline'
    ]),
    onClick      : PropTypes.func,
    isProcessing : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    isHidden     : PropTypes.bool,
    className    : PropTypes.string,
    children     : PropTypes.any.isRequired
};

Link.defaultProps = {
    color        : 'grey',
    variant      : 'normal',
    onClick      : void 0,
    isProcessing : false,
    isHidden     : false,
    isDisabled   : false,
    className    : ''
};

export default Link;

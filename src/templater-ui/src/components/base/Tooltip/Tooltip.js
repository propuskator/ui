import React            from 'react';
import PropTypes        from 'prop-types';
import Tooltip          from '@material-ui/core/Tooltip';
import classnames       from 'classnames/bind';

import styles           from './Tooltip.less';

const cx = classnames.bind(styles);

function CustomTooltip(props) {
    const {
        children,
        title,
        placement,
        interactive,
        ariaLabel,
        enterDelay,
        classes,
        isDisabled,
        ...rest
    } = props;

    if (!children) return null;

    return (
        <Tooltip
            {...rest}
            title       = {title || ''}
            placement   = {placement}
            interactive = {interactive}
            aria-label  = {ariaLabel || title}
            enterDelay  = {enterDelay}
            classes     = {{
                tooltip : cx(styles.tooltip, classes.tooltip),
                ...(classes || {})
            }}
            disableHoverListener = {isDisabled}
            disableTouchListener = {isDisabled}
            disableFocusListener = {isDisabled}
        >
            {children}
        </Tooltip>
    );
}

CustomTooltip.propTypes = {
    title     : PropTypes.any,
    placement : PropTypes.oneOf([
        'bottom-end',
        'bottom-start',
        'bottom',
        'left-end',
        'left-start',
        'left',
        'right-end',
        'right-start',
        'right',
        'top-end',
        'top-start',
        'top'
    ]),
    interactive : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    ariaLabel   : PropTypes.string,
    enterDelay  : PropTypes.number,
    children    : PropTypes.any.isRequired,
    classes     : PropTypes.shape({
        tooltip : PropTypes.string
    })
};

CustomTooltip.defaultProps = {
    title       : '',
    interactive : false,
    isDisabled  : false,
    placement   : 'bottom',
    ariaLabel   : '',
    enterDelay  : 400,
    classes     : {}
};

export default CustomTooltip;

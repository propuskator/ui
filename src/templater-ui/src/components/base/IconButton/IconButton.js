import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import IconButton               from '@material-ui/core/IconButton';

import SvgIcon                  from '../SvgIcon';

import styles                   from './IconButton.less';

const cx = classnames.bind(styles);

class CustomIconButton extends PureComponent {
    static propTypes = {
        forwardRef : PropTypes.shape({
            current : PropTypes.object
        }),
        onClick            : PropTypes.func,
        iconButtonProps    : PropTypes.shape({}),
        children           : PropTypes.node,
        className          : PropTypes.string,
        disableFocusRipple : PropTypes.bool,
        iconType           : PropTypes.string,
        iconClassName      : PropTypes.string,
        type               : PropTypes.oneOf([ 'abort-submit', 'button', '' ]),
        size               : PropTypes.oneOf([ 'S', 'M', '' ]),
        isDisabled         : PropTypes.bool
    }

    static defaultProps = {
        forwardRef         : void 0,
        onClick            : void 0,
        iconButtonProps    : void 0,
        children           : null,
        disableFocusRipple : false,
        className          : '',
        iconType           : '',
        type               : 'abort-submit',
        iconClassName      : '',
        size               : '',
        isDisabled         : false
    }

    componentDidMount() {
        const { forwardRef } = this.props;

        if (!forwardRef) return;

        forwardRef.current = {
            blur  : () => this?.iconButton?.blur(),
            focus : () => this?.iconButton?.focus()
        };
    }

    handleClick = e => {
        const { onClick, isDisabled } = this.props;

        if (onClick && !isDisabled) {
            onClick(e);
        }
    }

    render() {
        const {
            type,
            children,
            className,
            disableFocusRipple,
            iconType,
            iconClassName,
            isDisabled,
            size,
            iconButtonProps,
            ...rest
        } = this.props;

        const isIconDisabled = disableFocusRipple || isDisabled;

        const iconButtonCN = cx(styles.IconButton, type, {
            [className]     : className,
            [`size${size}`] : !!size,
            disableRipple   : isIconDisabled
        });

        return (
            <IconButton
                className          = {iconButtonCN}
                aria-label         = 'more'
                aria-controls      = 'long-menu'
                aria-haspopup      = 'true'
                onClick            = {this.handleClick}
                disableRipple      = {isIconDisabled}
                disableFocusRipple = {isIconDisabled}
                ref                = {node => this.iconButton = node}
                {...iconButtonProps}
            >
                { children
                    ? children
                    : <SvgIcon {...rest} type={iconType} className={iconClassName} />
                }
            </IconButton>
        );
    }
}

export default CustomIconButton;

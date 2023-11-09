/* eslint-disable no-magic-numbers */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Loader                   from '../Loader';
import CircularProgress         from '../CircularProgress';

import styles                   from './Button.less';

const cx = classnames.bind(styles);

class Button extends PureComponent {
    setRef = (ref) => {
        const { forwardRef } = this.props;

        if (!forwardRef) return;

        forwardRef.current = ref;
    }

    render() {
        const {
            onClick,
            isLoading,
            isDisabled,
            type,
            autoFocus,
            className,
            children,
            color,
            size,
            variant,
            forwardRef, // eslint-disable-line  no-unused-vars
            loaderColor,
            loaderType,
            ...rest
        } = this.props;
        const buttonCN = cx('Button', {
            [color]         : color,
            [variant]       : variant,
            [`size${size}`] : !!size,
            loading         : isLoading,
            disabled        : isDisabled,
            notDisabled     : !isDisabled,
            [className]     : className
        });

        function handleClick(e) {
            if (isDisabled || isLoading) return;

            if (onClick) onClick(e);
        }

        const loaderSize = [ 'M', 'S', 'XS', 'XXS' ].includes(size) ? 'XXS' : 'XS';

        return (
            <button
                type      = {type}
                tabIndex  = '0'
                className = {buttonCN}
                onClick   = {handleClick}
                disabled  = {isDisabled}
                autoFocus = {autoFocus}
                ref       = {this.setRef}
                {...rest}
            >
                { isLoading
                    ? (
                        <div className={cx(styles.loaderWrapper, { circleLoader: loaderType === 'circle' })}>
                            { loaderType === 'circle'
                                ? (
                                    <CircularProgress
                                        thickness = {3}
                                        color     = {loaderColor || 'white'}
                                    />
                                ) : (
                                    <Loader
                                        size = {loaderSize}
                                        color = {loaderColor || (variant === 'outlined' ? 'primary' : 'white')}
                                    />
                                )
                            }
                        </div>
                    ) : null
                }

                <div className={styles.childrenWrapper}>
                    {children}
                </div>
            </button>
        );
    }
}

Button.propTypes = {
    onClick     : PropTypes.func,
    isLoading   : PropTypes.bool,
    isDisabled  : PropTypes.bool,
    type        : PropTypes.string,
    autoFocus   : PropTypes.bool,
    forwardRef  : PropTypes.shape({ current: PropTypes.shape({ }) }),
    className   : PropTypes.string,
    size        : PropTypes.oneOf([ 'XXS', 'XS', 'S', 'M', 'L', 'XL', '' ]),
    loaderType  : PropTypes.oneOf([ 'circle', '' ]),
    children    : PropTypes.any,
    loaderColor : PropTypes.string,
    color       : PropTypes.oneOf([
        'actionButton',
        'orange',
        'primary600',
        'primaryGreen',
        'transparent',
        'lightRed',
        'red',
        'orange',
        'darkOrange',
        'greyMedium',
        'openButton',
        ''
    ]),
    variant : PropTypes.oneOf([
        'outlined',
        ''
    ])
};

Button.defaultProps = {
    onClick     : void 0,
    isLoading   : false,
    isDisabled  : false,
    size        : 'M',
    type        : '',
    autoFocus   : false,
    forwardRef  : void 0,
    loaderColor : void 0,
    className   : '',
    children    : void 0,
    color       : 'primary600',
    loaderType  : '',
    variant     : ''

};

export default Button;

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Tooltip                  from '../../base/Tooltip';

import styles                   from './CriticalValue.less';

const cx = classnames.bind(styles);

class CriticalValue extends PureComponent {
    state = {
        isOverflowed : false,
        isOpen       : false
    }

    handleTooltipClose = () => {
        this.setState({
            isOpen : false
        });
    }

    handleTooltipOpen = () => {
        const isOverflowed = this.detectOverflow();

        this.setState({
            isOpen : true && isOverflowed
        });
    }

    detectOverflow = () => {
        const { scrollWidth, clientWidth } = this.content;
        const isOverflowed = scrollWidth > clientWidth;

        return isOverflowed;
    }

    isValueIncludesSpaces() {
        const { value } = this.props;

        return !!value.trim().includes(' ');
    }


    render() {
        const {
            value, maxWidth, className, fontWeight, isBreakingValue,
            hideTooltip, interactive, onClick, isUnderline, isDisabled,
            color
        } = this.props;
        const { isOpen } = this.state;
        const breakValue = isBreakingValue && this.isValueIncludesSpaces() ? 'breakValue' : '';
        const criticalValueCN = cx('CriticalValue', {
            [className] : className,
            hoverable   : onClick,
            underline   : isUnderline,
            breakValue
        });
        const tooltipCN = cx('tooltip', { hide: hideTooltip || isDisabled });

        return (
            <div
                className = {criticalValueCN}
                style     = {{ maxWidth }}
                onClick   = {onClick}
            >
                <Tooltip
                    title       = {value}
                    onOpen      = {this.handleTooltipOpen}
                    onClose     = {this.handleTooltipClose}
                    open        = {isOpen}
                    interactive = {interactive}
                    isDisabled  = {isDisabled}
                    classes     = {{
                        tooltip : tooltipCN
                    }}
                >
                    <div className={styles.valueWrapper} style={{ fontWeight: fontWeight || '', color }} ref={node => this.content = node}>
                        {value}
                    </div>
                </Tooltip>
            </div>
        );
    }
}

CriticalValue.propTypes = {
    value           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    maxWidth        : PropTypes.string,
    className       : PropTypes.string,
    fontWeight      : PropTypes.string,
    isBreakingValue : PropTypes.bool,
    hideTooltip     : PropTypes.bool,
    interactive     : PropTypes.bool,
    isUnderline     : PropTypes.bool,
    onClick         : PropTypes.func,
    isDisabled      : PropTypes.bool,
    color           : PropTypes.string
};

CriticalValue.defaultProps = {
    value           : '—',
    maxWidth        : '100%',
    className       : null,
    isBreakingValue : false,
    hideTooltip     : false,
    fontWeight      : null,
    interactive     : false,
    isUnderline     : false,
    onClick         : void 0,
    isDisabled      : false,
    color           : ''
};

export default CriticalValue;

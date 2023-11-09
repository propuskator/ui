/* eslint-disable  babel/no-unused-expressions */
import React, {
    memo,
    useRef,
    useEffect
}                      from 'react';
import PropTypes       from 'prop-types';
import classnames      from 'classnames/bind';

import SvgIcon         from '../../SvgIcon';

import styles          from './ColorCell.less';

const cx = classnames.bind(styles);

function ColorCell(props) {
    const {
        color : colorValue,
        isSelected,
        autoFocus,
        isPrevSelected,
        size,
        hoverStyle,
        onClick,
        className
    } = props;
    const colorCellRef = useRef({});

    useEffect(() => {
        if (autoFocus) colorCellRef?.current?.focus();
    }, []);

    function handleColorCellClick() {
        if (onClick) onClick(colorValue);
    }

    const colorCellCN = cx(styles.ColorCell, {
        [`ColorCell-${size}`]   : true,
        ColorCellSelected       : isSelected,
        [`hover-${hoverStyle}`] : true,
        [className]             : className
    });

    const checkIconSize = { 'S': 7, 'M': 16 }[size];

    return (
        <button
            tabIndex  = '0'
            type      = 'button'
            // if button classList includes 'abort-submit' cn it will be abort auto submit on it
            className = {`${colorCellCN} ${isSelected ? 'button' : 'abort-submit' }`}
            ref       = {node => colorCellRef.current = node}
            style     = {{ backgroundColor: colorValue }}
            // eslint-disable-next-line react/jsx-no-bind
            onClick   = {handleColorCellClick}
        >
            { isSelected
                ? (
                    <SvgIcon
                        type      = 'checkOutlined'
                        color     = 'white'
                        size      = {checkIconSize}
                        className = {styles.checkIcon}
                    />
                ) : null
            }

            { isPrevSelected && !isSelected
                ? (
                    <div className={styles.prevSelectedMark} />
                ) : null
            }
        </button>
    );
}

ColorCell.propTypes = {
    color          : PropTypes.string.isRequired,
    isSelected     : PropTypes.bool,
    isPrevSelected : PropTypes.bool,
    size           : PropTypes.oneOf([ 'S', 'M' ]),
    hoverStyle     : PropTypes.oneOf([ 'opacity', 'border', 'shadow' ]),
    onClick        : PropTypes.func,
    autoFocus      : PropTypes.bool,
    className      : PropTypes.string
};

ColorCell.defaultProps = {
    isSelected     : false,
    isPrevSelected : false,
    autoFocus      : false,
    size           : 'M',
    hoverStyle     : 'opacity',
    onClick        : void 0,
    className      : ''
};

export default memo(ColorCell);

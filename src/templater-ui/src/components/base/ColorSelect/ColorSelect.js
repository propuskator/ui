/* eslint-disable react/jsx-max-props-per-line */

import React, {
    memo
}                               from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import SvgIcon                  from './../../base/SvgIcon';

import styles                   from './ColorSelect.less';

const cx = classNames.bind(styles);

function ColorSelect(props) {
    const { colors, activeColorId, onChangeColor, className } = props;

    function handleChangeColor({ id, color }) {
        return e => {
            if (e) e.preventDefault();
            if (e) e.stopPropagation();

            if (id === activeColorId) return;
            onChangeColor({ id, color });
        };
    }

    const colorSelectCN = cx(styles.ColorSelect, { [className]: className });

    return (
        <div className = {colorSelectCN}>
            { colors.map(({ id, color }) => {
                const isActive = id === activeColorId;

                return (
                    <div key={id} className={styles.menuItemWrapper}>
                        <button
                            className = {cx(styles.menuItem, {
                                active : isActive
                            })}
                            onClick   = {handleChangeColor({ id, color })}
                            style     = {{
                                background : color
                            }}
                        />
                        {isActive
                            ? (
                                <SvgIcon type ='check' className={styles.activeIcon} />
                            ) : null
                        }
                    </div>
                );
            })}
        </div>
    );
}


ColorSelect.propTypes = {
    className : PropTypes.string,
    colors    : PropTypes.arrayOf(PropTypes.shape({
        id    : PropTypes.string,
        color : PropTypes.string
    })),
    activeColorId : PropTypes.string,
    onChangeColor : PropTypes.func.isRequired
};

ColorSelect.defaultProps = {
    className     : '',
    colors        : [],
    activeColorId : void 0
};

export default memo(ColorSelect);

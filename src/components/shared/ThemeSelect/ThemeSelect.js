/* eslint-disable react/jsx-max-props-per-line */

import React, {
    useContext,
    memo
}                               from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import Typography               from 'templater-ui/src/components/base/Typography';

import {
    ThemeContext,
    AVAILABLE_THEMES,
    THEMES_MAP,
    THEMES
}                               from 'Context/theme';
import SvgIcon                  from 'Base/SvgIcon';

import styles                   from './ThemeSelect.less';

const cx = classNames.bind(styles);

const THEME_BG_BY_TYPE = { };

Object.keys(THEMES_MAP).forEach(themeKey => {
    THEME_BG_BY_TYPE[themeKey] = THEMES[themeKey]['--color_primary--700'];
});

function ThemeSelect(props) {
    const { className, withTitle } = props;
    const { theme, changeTheme } = useContext(ThemeContext);

    function handleChangeTheme(selectedTheme) {
        return (e) => {
            if (e) e.preventDefault();
            if (e) e.stopPropagation();

            if (theme === selectedTheme) return;

            changeTheme(selectedTheme);
        };
    }

    const availableThemesList = AVAILABLE_THEMES;
    const themeSelectCN = cx(styles.ThemeSelect, {
        [className] : className
    });

    return (
        <div className={themeSelectCN}>
            { withTitle
                ? (
                    <Typography variant='headline3' className={styles.title}>
                        Цветовая схема
                    </Typography>
                ) : null
            }
            <div className={styles.availableThemes}>
                { availableThemesList.map(themeKey => {
                    const isActive = themeKey === theme;

                    return (
                        <div key={themeKey} className={styles.menuItemWrapper}>
                            <button
                                className = {cx(styles.menuItem, {
                                    active : isActive
                                })}
                                onClick   = {handleChangeTheme(themeKey)}
                                style     = {{
                                    background : THEME_BG_BY_TYPE[themeKey]
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
        </div>
    );
}

ThemeSelect.propTypes = {
    className : PropTypes.string,
    withTitle : PropTypes.bool
};

ThemeSelect.defaultProps = {
    className : '',
    withTitle : true
};

export default memo(ThemeSelect);

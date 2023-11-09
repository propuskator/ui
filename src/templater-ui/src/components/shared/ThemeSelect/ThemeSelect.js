/* eslint-disable react/jsx-max-props-per-line */

import React, {
    memo, useCallback
} from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import {
    AVAILABLE_THEMES,
    THEMES_MAP,
    THEMES
}                               from './../../../constants/themes';
import Typography               from './../../base/Typography';
import ColorSelect              from './../../base/ColorSelect';

import styles                   from './ThemeSelect.less';

const cx = classNames.bind(styles);

const THEME_BG_BY_TYPE = { };

Object.keys(THEMES_MAP).forEach(themeKey => {
    THEME_BG_BY_TYPE[themeKey] = THEMES[themeKey]['--color_primary--700'];
});

function ThemeSelect(props) {
    const { theme, changeTheme, className, withTitle, availableThemes, themesBgByType, t } = props;

    const handleChangeColor = useCallback(({ id }) => {
        changeTheme(id);
    }, [ changeTheme ]);

    function getThemeBg(themeKey) {
        return themesBgByType?.length
            ? themesBgByType[themeKey]
            : THEME_BG_BY_TYPE[themeKey];
    }

    const availableThemesList = availableThemes || AVAILABLE_THEMES;
    const colorList = availableThemesList.map(themeKey => ({ id: themeKey, color: getThemeBg(themeKey) }));

    const themeSelectCN = cx(styles.ThemeSelect, {
        [className] : className
    });

    return (
        <div className={themeSelectCN}>
            { withTitle
                ? (
                    <Typography variant='headline3' className={styles.title}>
                        {t('Color scheme')}
                    </Typography>
                ) : null
            }
            <ColorSelect
                className     = {styles.availableThemes}
                colors        = {colorList}
                activeColorId = {theme}
                onChangeColor = {handleChangeColor}
            />
        </div>
    );
}

ThemeSelect.propTypes = {
    className       : PropTypes.string,
    withTitle       : PropTypes.bool,
    themesBgByType  : PropTypes.shape({}),
    t               : PropTypes.func,
    theme           : PropTypes.string,
    changeTheme     : PropTypes.func.isRequired,
    availableThemes : PropTypes.arrayOf()
};

ThemeSelect.defaultProps = {
    className       : '',
    withTitle       : true,
    themesBgByType  : void 0,
    theme           : void 0,
    availableThemes : void 0,
    t               : (text) => text
};

export default memo(ThemeSelect);

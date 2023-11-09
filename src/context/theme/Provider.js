import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import * as localStorageUtils   from 'templater-ui/src/utils/helpers/localStorage';
import { THEME_KEY }            from 'Constants/localStorage';
import {
    DEFAULT_THEME,
    AVAILABLE_THEMES,
    THEMES
}                               from './themes';

const selectedTheme = localStorageUtils.getData(THEME_KEY);

const INTIIAL_THEME = AVAILABLE_THEMES?.includes(selectedTheme) ? selectedTheme : DEFAULT_THEME;


export const ThemeContext = React.createContext({
    theme         : INTIIAL_THEME,
    onToogleTheme : () => {}
});


export default class ThemeProvider extends PureComponent {
    static propTypes = {
        children : PropTypes.node
    };

    static defaultProps = {
        children : null
    };

    constructor(props) {
        super(props);

        this.setCssVariablesByTheme(INTIIAL_THEME);

        this.state = {
            theme : INTIIAL_THEME
        };
    }

    handleChangeTheme = (theme) => {
        if (this.state.theme === theme) return;

        if (!AVAILABLE_THEMES.includes(theme)) return;

        this.setCssVariablesByTheme(theme);

        this.setState({ theme });
    }

    setCssVariablesByTheme = (theme) => {
        Object.keys(THEMES[theme]).forEach(key => {
            document.documentElement.style.setProperty(key, THEMES[theme][key]);
        });

        localStorageUtils.saveData(THEME_KEY, theme);
    }

    render() {
        const { children } = this.props;
        const { theme } = this.state;

        return (
            <ThemeContext.Provider
                value = {{
                    theme,
                    changeTheme : this.handleChangeTheme
                }}
            >
                { children }
            </ThemeContext.Provider>
        );
    }
}

import React                    from 'react';

import {
    THEMES,
    THEMES_MAP,
    AVAILABLE_THEMES
}                               from './themes';
import ThemeProvider, {
    ThemeContext
}                               from './Provider';

function withTheme(Component) {
    return function ConnectedComponent(props) {
        return (
            <ThemeContext.Consumer>
                { ({ theme, changeTheme }) => (
                    <Component
                        {...props}
                        theme       = {theme}
                        changeTheme = {changeTheme}
                    />
                )}
            </ThemeContext.Consumer>
        );
    };
}


export {
    withTheme,
    ThemeProvider,
    ThemeContext,
    AVAILABLE_THEMES,
    THEMES_MAP,
    THEMES
};

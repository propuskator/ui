// import '@babel/polyfill';    // deprecated as of Babel 7.4.0
import 'core-js/stable';
import 'regenerator-runtime/runtime';
// import 'isomorphic-fetch';

import React            from 'react';
import ReactDOM         from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider }     from 'react-redux';

import store            from 'Store';

import './i18n';


function render(Component) {
    ReactDOM.render(
        <Provider store={store}>
            <AppContainer>
                <Component />
            </AppContainer>
        </Provider>,
        document.getElementById('root')
    );
}

export function mountApp() {
    const NextApp = require('./App.js').default;

    render(NextApp);
}

mountApp();

if (module.hot) {
    module.hot.accept('./App.js', () => mountApp());
}


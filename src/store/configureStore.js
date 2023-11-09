/* eslint-disable more/no-window */
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import reducers                         from '../reducers';

export default function configureStore(initialState) {
    return createStore(
        reducers,
        initialState,
        compose(
            applyMiddleware(thunkMiddleware),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    );
}

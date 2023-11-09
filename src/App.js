/* eslint-disable react/jsx-no-bind, react/no-multi-comp, max-len, react/jsx-max-props-per-line */
import React, { Component }     from 'react';
import { Route, Switch,
    Redirect }                  from 'react-router';
import { Router }               from 'react-router-dom';

import * as ROUTES              from 'Constants/routes';
import history                  from 'History';
import MainLayout               from 'Layouts/MainLayout';
import AuthLayout               from 'Layouts/AuthLayout';
import AccessSettings           from 'Pages/AccessSettings';
import Login                    from 'Pages/Login';
import Register                 from 'Pages/Register';
import PasswordRestore          from 'Pages/PasswordRestore';
import PasswordChange           from 'Pages/PasswordChange';
import APISettings              from 'Pages/APISettings';
import AccessLogs               from 'Pages/AccessLogs';
import AccessTokenReaders       from 'Pages/AccessTokenReaders';
import AccessReadersGroups      from 'Pages/AccessReadersGroups';
import AccessSubjects           from 'Pages/AccessSubjects';
import AccessSubjectTokens      from 'Pages/AccessSubjectTokens';
import AccessSchedules          from 'Pages/AccessSchedules';
import AccountSettings          from 'Pages/AccountSettings';
import Cameras                  from 'Pages/Cameras';
import DownloadApp              from 'Pages/DownloadApp';
import { ThemeProvider }        from './context/theme';

import './App.less';

function reservedLayout(props) {
    return props.children;
}

function AppRoute({ component: Page, layout, ...rest }) {   // eslint-disable-line react/prop-types
    return (
        <Route
            {...rest}
            render={props => {
                const Layout = layout ? layout : reservedLayout;

                return (
                    <MainLayout>
                        <Layout>
                            <Page
                                {...props}
                                refreshKey = {rest?.location?.key}
                            />
                        </Layout>
                    </MainLayout>
                );
            }}
        />
    );
}


class App extends Component {  // Should be Component (without scu) to make context changing works
    render() {
        return (
            <ThemeProvider>
                <Router history={history}>
                    <Switch>
                        <AppRoute path={ROUTES.LOGIN}  component={Login} exact />
                        <AppRoute path={ROUTES.REGISTER} component={Register} exact />
                        <AppRoute path={ROUTES.MOB_DEEPLINKS_FALLBACK} component={DownloadApp} exact />
                        <AppRoute path={ROUTES.PASSWORD_RESTORE} component={PasswordRestore} exact />
                        <AppRoute path={ROUTES.PASSWORD_CHANGE} component={PasswordChange} exact />

                        <AppRoute
                            exact
                            path      = {ROUTES.ROOT}
                            component = {AccessSettings}
                            layout    = {AuthLayout}
                        />

                        <AppRoute path={ROUTES.ACCESS_SETTINGS}  component={AccessSettings}   layout={AuthLayout} exact />
                        <AppRoute path={ROUTES.API_SETTINGS}     component={APISettings}      layout={AuthLayout} exact />
                        <AppRoute path={ROUTES.ACCESS_LOGS}      component={AccessLogs}       layout={AuthLayout} exact />
                        <AppRoute path={ROUTES.ACCESS_SUBJECTS}  component={AccessSubjects}   layout={AuthLayout} exact />
                        <AppRoute path={ROUTES.ACCESS_SCHEDULES} component={AccessSchedules}  layout={AuthLayout} exact />
                        <AppRoute path={ROUTES.ACCOUNT_SETTINGS} component={AccountSettings}  layout={AuthLayout} exact />
                        <AppRoute path={ROUTES.CAMERAS}          component={Cameras}          layout={AuthLayout} exact />

                        <AppRoute
                            path      = {ROUTES.ACCESS_TOKEN_READERS}
                            component = {AccessTokenReaders}
                            layout    = {AuthLayout}
                            exact
                        />

                        <AppRoute
                            path      = {ROUTES.ACCESS_READERS_GROUPS}
                            component = {AccessReadersGroups}
                            layout    = {AuthLayout}
                            exact
                        />

                        <AppRoute
                            path      = {ROUTES.ACCESS_SUBJECT_TOKENS}
                            component = {AccessSubjectTokens}
                            layout    = {AuthLayout}
                            exact
                        />


                        <Redirect
                            to={{
                                pathname : ROUTES.ACCESS_SETTINGS,
                                state    : { from: ROUTES.NO_MATCH }
                            }}
                        />
                    </Switch>
                </Router>
            </ThemeProvider>
        );
    }
}

export default App;

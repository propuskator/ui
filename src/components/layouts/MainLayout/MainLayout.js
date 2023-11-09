import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';

import { LOGOUT_EVENT }         from 'templater-ui/src/constants/localStorage';

import ToastsContainer          from 'Shared/ToastsContainer';

import * as KEY_CODES           from 'Constants/keyCodes';
import sessionManager           from 'Utils/sessions';

import styles                   from './MainLayout.less';

class MainLayout extends PureComponent {
    static propTypes = {
        children : PropTypes.element.isRequired,
        logout   : PropTypes.func.isRequired
    }

    state = {
        isSessionChecked : false
    }

    componentDidMount() {
        window.addEventListener('storage', this.logoutInactiveTab);
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('keyup', this.handleKeyPressed);
        this.checkSession();
    }

    componentWillUnmount() {
        window.removeEventListener('storage', this.logoutInactiveTab);
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keyup', this.handleKeyPressed);
    }

    resetFocus = () => {
        const isResetFocus = [ 'BUTTON', 'A' ].includes(document?.activeElement?.nodeName);

        if (isResetFocus) {
            document.activeElement.blur();
        }
    }

    handleDocumentClick = () => {
        this.resetFocus();
    }

    handleKeyPressed = (e) => {
        if (e.keyCode === KEY_CODES.ESCAPE) {
            this.resetFocus();
        }
    }

    logoutInactiveTab = (e) => {
        const { logout } = this.props;

        if (e.key === LOGOUT_EVENT) logout();
    }

    async checkSession() {
        const { fetchAccountSettings, fetchWorkspaceSettings } = this.props;

        try {
            await fetchAccountSettings();
            await fetchWorkspaceSettings();

            sessionManager.onSessionChecked({ isSuccess: true });
        } catch (error) {
            console.error({ error });

            sessionManager.onSessionDestroy({ type: 'forbidden' });
        } finally {
            document.getElementById('container').remove();
            this.setState({
                isSessionChecked : true
            });
        }
    }

    render() {
        const { children } = this.props;
        const { isSessionChecked } = this.state;

        return (
            <div className={styles.MainLayout}>
                {isSessionChecked
                    ? children
                    : null
                }
                <ToastsContainer />
            </div>
        );
    }
}

export default MainLayout;

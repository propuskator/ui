import React, { PureComponent } from 'react';   // eslint-disable-line  no-unused-vars
import PropTypes                from 'prop-types';

import { TOASTS_KEYS }          from '../../../constants/toasts';


class CookiesCheck extends PureComponent {
    static propTypes = {
        addToast         : PropTypes.func.isRequired,
        removeToastByKey : PropTypes.func.isRequired
    }

    state = {
        isCookiesEnabled : true
    }

    componentDidMount() {
        this.startCookiesCheck();
    }

    componentWillUnmount() {
        this.stopCookiesCheck();
    }

    startCookiesCheck = () => {
        // eslint-disable-next-line no-magic-numbers
        const EVERY_5_MIN = 60e3 * 5;

        this.interval = setInterval(() => {
            this.checkCookies();
        }, EVERY_5_MIN);
    }

    stopCookiesCheck = () => {
        clearInterval(this.interval);
    }

    checkCookies() {
        const { isCookiesEnabled } = this.state;
        const { addToast, removeToastByKey } = this.props;
        const cookieEnabled = navigator.cookieEnabled;

        if (cookieEnabled === isCookiesEnabled) return;

        if (!cookieEnabled) {
            addToast({
                key                  : TOASTS_KEYS.cookies,
                title                : 'Something went wrong',
                message              : 'Seems that cookies are disabled. Please, try to enable cookies.',
                showOnSessionDestroy : true,
                hideByTimeout        : false,
                withCloseAbility     : false,
                type                 : 'error'
            });
        } else {
            removeToastByKey(TOASTS_KEYS.cookies);
        }

        this.setState({
            isCookiesEnabled : cookieEnabled
        });
    }

    render() {
        return null;
    }
}

export default CookiesCheck;

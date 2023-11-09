import React                from 'react';
import PropTypes            from 'prop-types';

import LoginServiceButton   from '../LoginServiceButton';

function GoogleLogin(props) {
    const {
        onResponse
    } = props;

    async function handleGoogleLogIn() {
        try {
            const googleAuth = window.gapi.auth2.getAuthInstance();
            const response = await googleAuth.signIn();
            const authResponse = response.getAuthResponse(true);

            onResponse({ authResponse });
        } catch (e) {
            console.log('Error handleGoogleLogin: ', e);
        }
    }

    return (
        <LoginServiceButton
            iconType   = 'google'
            onClick    = {handleGoogleLogIn}
        >
            Google
        </LoginServiceButton>
    );
}

GoogleLogin.propTypes = {
    onResponse : PropTypes.func.isRequired
};

export default GoogleLogin;

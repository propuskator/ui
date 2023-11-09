import React                from 'react';
import PropTypes            from 'prop-types';

import LoginServiceButton   from '../LoginServiceButton';

function FacebookLogin(props) {
    const {
        scope, onResponse
    } = props;

    function handleFacebookLogin() {
        window.FB.getLoginStatus(resp => {
            if (resp?.status === 'connected') {
                onResponse(resp);
            } else {
                window.FB.login(onResponse, { scope });
            }
        });
    }

    return (
        <LoginServiceButton
            iconType   = 'facebook'
            onClick    = {handleFacebookLogin}
        >
            Facebook
        </LoginServiceButton>
    );
}

FacebookLogin.propTypes = {
    scope      : PropTypes.string,
    onResponse : PropTypes.func.isRequired
};

FacebookLogin.defaultProps = {
    scope : 'public_profile,email'
};

export default FacebookLogin;

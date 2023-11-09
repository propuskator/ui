import Base from './Base.js';

class Sessions extends Base {
    login(payload) {
        return this.apiClient.post('vendor/login', payload);
    }

    loginFacebook(payload) {
        return this.apiClient.post('vendor/login/facebook', payload);
    }

    loginGoogle(payload) {
        return this.apiClient.post('vendor/login/google', payload);
    }

    logout() {
        return this.apiClient.post('vendor/logout');
    }

    register(payload) {
        return this.apiClient.post('vendor/register', payload);
    }

    getCsrf() {
        return this.apiClient.get('csrf_token');
    }

    passwordRestore(payload) {
        return this.apiClient.post('vendor/request-reset-password', payload);
    }

    passwordChange(payload) {
        return this.apiClient.post('vendor/reset-password', payload);
    }

    checkResetPasswordToken(payload) {
        return this.apiClient.post('vendor/check-reset-password-token', payload);
    }
}

export default Sessions;

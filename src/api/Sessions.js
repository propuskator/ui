import Base from './Base.js';

class Sessions extends Base {
    login(payload) {
        return this.apiClient.post('login', payload);
    }

    register(payload) {
        return this.apiClient.post('register', payload);
    }

    passwordRestore(payload) {
        return this.apiClient.post('requestPasswordReset', payload);
    }

    passwordChange(payload) {
        return this.apiClient.post('passwordReset', payload);
    }
}

export default Sessions;

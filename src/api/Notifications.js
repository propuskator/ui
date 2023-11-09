import Base from './Base.js';

class Notifications extends Base {
    list(params) {
        return this.apiClient.get('notifications', params, { withoutTokenRefresh: true });
    }

    activate(data) {
        return this.apiClient.patch('notifications/activate', data);
    }

    deactivate(data) {
        return this.apiClient.patch('notifications/deactivate', data);
    }

    readAll() {
        return this.apiClient.post('notifications/readAll');
    }
}

export default Notifications;

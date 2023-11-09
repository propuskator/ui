import Base from './Base.js';

class AccountSettings extends Base {
    getData() {
        return this.apiClient.get('vendor/profile');
    }

    edit(data) {
        return this.apiClient.post('vendor/update', data);
    }

    editPassword(data) {
        return this.apiClient.post('vendor/change-password', data);
    }

    updateAvatar(data) {
        return this.apiClient.post('vendor/files', data, { isFormData: true });
    }

    sendReport(data) {
        return this.apiClient.post('vendor/reported-issues', data);
    }
}

export default AccountSettings;

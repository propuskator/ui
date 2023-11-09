import Base                     from './Base.js';

class AccountSettings extends Base {
    getData() {
        return this.apiClient.get('profile');
    }

    edit(data) {
        return this.apiClient.patch('profile', data);
    }

    updateAvatar(data) {
        return this.apiClient.patch('profile', data, { isFormData: true });
    }

    sendReport(data) {
        return this.apiClient.post('reported-issues', data);
    }
}

export default AccountSettings;

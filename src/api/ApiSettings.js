import Base from './Base.js';

class ApiSettings extends Base {
    getData() {
        return this.apiClient.get('access-api-settings');
    }

    refresh() {
        return this.apiClient.patch('access-api-settings/refresh');
    }
}

export default ApiSettings;

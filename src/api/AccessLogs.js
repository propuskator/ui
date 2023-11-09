import Base from './Base.js';

class AccessLogs extends Base {
    list(params) {
        return this.apiClient.get('access-logs', params);
    }
}

export default AccessLogs;

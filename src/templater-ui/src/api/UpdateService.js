import Base from './Base.js';

class UpdateService extends Base {
    getChangelog() {
        return this.apiClient.get('changelog');
    }
}

export default UpdateService;

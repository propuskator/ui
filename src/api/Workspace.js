import Base from './Base.js';

class Workspace extends Base {
    getSettings() {
        return this.apiClient.get('workspace/settings');
    }

    patchSettings(body) {
        return this.apiClient.patch('workspace/settings', body);
    }
}

export default Workspace;

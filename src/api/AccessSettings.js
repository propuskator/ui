import Base from './Base.js';

class accessSettings extends Base {
    list(params) {
        return this.apiClient.get('access-settings', params);
    }

    create(body) {
        return this.apiClient.post('access-settings', body);
    }

    edit(id, body) {
        return this.apiClient.put(`access-settings/${id}`, body);
    }

    patch(id, body) {
        return this.apiClient.patch(`access-settings/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`access-settings/${id}`);
    }
}

export default accessSettings;

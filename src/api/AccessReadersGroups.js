import Base from './Base.js';

class AccessReadersGroups extends Base {
    list(params) {
        return this.apiClient.get('access-reader-groups', params);
    }

    delete(id) {
        return this.apiClient.delete(`access-reader-groups/${id}`);
    }

    create(body) {
        return this.apiClient.post('access-reader-groups', body);
    }

    edit(id, body) {
        return this.apiClient.patch(`access-reader-groups/${id}`, body);
    }
}

export default AccessReadersGroups;

import Base from './Base.js';

class AccessSubjectTokens extends Base {
    list(params) {
        return this.apiClient.get('access-subject-tokens', params);
    }

    create(body) {
        return this.apiClient.post('access-subject-tokens', body);
    }

    createBulk(body) {
        return this.apiClient.post('access-subject-tokens/bulk-create', body);
    }

    edit(id, body) {
        return this.apiClient.patch(`access-subject-tokens/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`access-subject-tokens/${id}`);
    }

    exportCsv() {
        return this.apiClient.get('access-subject-tokens/export/csv');
    }
}

export default AccessSubjectTokens;

import Base from './Base.js';

class AccessSubjects extends Base {
    list(params) {
        return this.apiClient.get('access-subjects', params);
    }

    create(body) {
        return this.apiClient.post('access-subjects', body, { isFormData: true });
    }

    createOnRequest(body) {
        return this.apiClient.post('access-subjects/createOnRequest', body, { isFormData: true });
    }

    edit(id, body) {
        return this.apiClient.put(`access-subjects/${id}`, body, { isFormData: true });
    }

    patch(id, body) {
        return this.apiClient.patch(`access-subjects/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`access-subjects/${id}`);
    }

    invite(id) {
        return this.apiClient.post(`access-subjects/invite/${id}`);
    }

    exportCsv() {
        return this.apiClient.get('access-subjects/export/csv');
    }
}

export default AccessSubjects;

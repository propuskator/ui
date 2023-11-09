import Base from './Base.js';

class AccessSchedules extends Base {
    list(params) {
        return this.apiClient.get('access-schedules', params);
    }

    create(body) {
        return this.apiClient.post('access-schedules', body);
    }

    edit(id, body) {
        return this.apiClient.patch(`access-schedules/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`access-schedules/${id}`);
    }
}

export default AccessSchedules;

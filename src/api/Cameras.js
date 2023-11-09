import Base from './Base.js';

class Cameras extends Base {
    list(params) {
        return this.apiClient.get('access-cameras', params);
    }

    create(body) {
        return this.apiClient.post('access-cameras', body);
    }

    edit(id, body) {
        return this.apiClient.patch(`access-cameras/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`access-cameras/${id}`);
    }
}

export default Cameras;

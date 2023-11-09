import Base from './Base.js';

class References extends Base {
    getByName(name, params) {
        return this.apiClient.get(`/references/${name}`, params);
    }
}

export default References;

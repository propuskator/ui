import Base from './Base.js';

class AccessTokenReaders extends Base {
    list(params) {
        return this.apiClient.get('access-token-readers', params);
    }

    listPhoneNumbers() {
        return this.apiClient.get('access-token-readers/phone-numbers');
    }

    addDisplayedTopic(body) {
        return this.apiClient.post('access-token-readers/add-displayed-topic', body);
    }

    deleteDisplayedTopic(body) {
        return this.apiClient.post('access-token-readers/remove-displayed-topic', body);
    }

    create(body) {
        return this.apiClient.post('access-token-readers', body);
    }

    edit(id, body) {
        return this.apiClient.patch(`access-token-readers/${id}`, body);
    }

    delete(id) {
        return this.apiClient.delete(`access-token-readers/${id}`);
    }
}

export default AccessTokenReaders;

import Base from './Base.js';

class Files extends Base {
    uploadFile(data) {
        return this.apiClient.post('vendor/files', data, { isFormData: true });
    }
}

export default Files;

import Base from './Base.js';

class Utils extends Base {
    convertCsvToJson(body) {
        return this.apiClient.post('utils/csv-to-json', body, { isFormData: true });
    }
}

export default Utils;

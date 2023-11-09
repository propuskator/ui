import Base from './Base.js';

class Broker extends Base {
    getMqttCredentials() {
        return this.apiClient.get('mqttCredentials');
    }
}

export default Broker;

import ApiClient            from '../api/ApiClient';

import SessionsAPI          from '../api/Sessions';
import AccountSettingsAPI   from '../api/AccountSettings';
import UpdateServiceAPI     from '../api/UpdateService';

const apiClient = new ApiClient({
    apiUrl : '127.0.0.1'
});

const API = {
    apiClient,
    sessions        : new SessionsAPI({ apiClient }),
    accountSettings : new AccountSettingsAPI({ apiClient }),
    files           : {
        uploadFile : async () => {}
    },
    updateService : new UpdateServiceAPI({ apiClient })
};

export default API;

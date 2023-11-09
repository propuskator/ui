import config     from 'Config';
import apiFactory from './api';

export default apiFactory({
    apiPrefix        : config.apiPrefix,
    apiUrl           : config.apiUrl,
    apiUpdaterPrefix : config.apiUpdaterPrefix || '/updater/v1/',
    apiUpdaterUrl    : config.apiUpdaterUrl || '.'
});

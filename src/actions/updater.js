import api     from 'ApiSingleton';
import actions from './moduleActions';

const { updateService } = actions;

/* bad fix of circular dep */
updateService.api = api;

export const fetchChangelog = updateService.fetchChangelog;

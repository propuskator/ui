import api              from 'ApiSingleton';
/* TODO: fix of circular dep -> api is undefined here =( */
import Toasts           from './toasts';
import View             from './view';
import UpdaterService   from './updater';


const toasts          = new Toasts(api);
const view            = new View(api);
const updateService   = new UpdaterService(api);


updateService.openModal     = view.openModal;

export default {
    toasts,
    view,
    updateService
};

import { combineReducers }      from 'redux';

import updater                  from 'templater-ui/src/reducers/updater';
import view                     from 'templater-ui/src/reducers/view';
import toasts                   from 'templater-ui/src/reducers/toasts';

import sessions                 from './sessions';
import accessSubjectTokens      from './accessSubjectTokens';
import accessTokenReaders       from './accessTokenReaders';
import accessReadersGroups      from './AccessReadersGroups';
import accessSubjects           from './accessSubjects';
import apiSettings              from './apiSettings';
import accessLogs               from './accessLogs';
import accessSettings           from './accessSettings';
import accessSchedules          from './accessSchedules';
import accountSettings          from './accountSettings';
import notifications            from './notifications';
import broker                   from './broker';
import devices                  from './devices';
import cameras                  from './cameras';
import workspace                from './workspace';


export default combineReducers({
    sessions,
    accessSubjectTokens,
    view,
    toasts,
    accessTokenReaders,
    accessReadersGroups,
    accessSubjects,
    apiSettings,
    accessLogs,
    accessSettings,
    accessSchedules,
    accountSettings,
    notifications,
    broker,
    devices,
    cameras,
    updater,
    workspace
});

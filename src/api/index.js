import ApiClient                  from './ApiClient';
import SessionsAPI                from './Sessions';
import AccessSubjectTokensAPI     from './AccessSubjectTokens';
import AccessTokenReadersAPI      from './AccessTokenReaders';
import AccessReadersGroupsAPI     from './AccessReadersGroups';
import AccessSubjectsAPI          from './AccessSubjects';
import ApiSettingsAPI             from './ApiSettings';
import AccessLogsAPI              from './AccessLogs';
import AccountSettingsAPI         from './AccountSettings';
import AccessSettingsAPI          from './AccessSettings';
import AccessSchedulesAPI         from './AccessSchedules';
import NotificationsAPI           from './Notifications';
import BrokerAPI                  from './Broker';
import CamerasAPI                 from './Cameras';
import UpdateServiceAPI           from './UpdateService';
import ReferencesAPI              from './References';
import UtilsAPI                   from './Utils';
import WorkspaceAPI               from './Workspace';


export default function apiModule({ apiPrefix, apiUrl, apiUpdaterPrefix, apiUpdaterUrl } = {}) {
    if (!apiPrefix) {
        throw new Error('[apiPrefix] required');
    }

    if (!apiUrl) {
        throw new Error('[apiUrl] required');
    }

    if (!apiUpdaterPrefix) {
        throw new Error('[apiUpdaterPrefix] required');
    }

    if (!apiUpdaterUrl) {
        throw new Error('[apiUpdaterUrl] required');
    }

    const api = new ApiClient({ prefix: apiPrefix, apiUrl  });
    const apiUpdater = new ApiClient({ prefix: apiUpdaterPrefix, apiUrl: apiUpdaterUrl, withFetchError: false });

    return {
        apiClient           : api,
        sessions            : new SessionsAPI({ apiClient: api }),
        accessSubjectTokens : new AccessSubjectTokensAPI({ apiClient: api }),
        accessTokenReaders  : new AccessTokenReadersAPI({ apiClient: api }),
        accessReadersGroups : new AccessReadersGroupsAPI({ apiClient: api }),
        accessSubjects      : new AccessSubjectsAPI({ apiClient: api }),
        apiSettings         : new ApiSettingsAPI({ apiClient: api }),
        accessLogs          : new AccessLogsAPI({ apiClient: api }),
        accountSettings     : new AccountSettingsAPI({ apiClient: api }),
        accessSettings      : new AccessSettingsAPI({ apiClient: api }),
        accessSchedules     : new AccessSchedulesAPI({ apiClient: api }),
        notifications       : new NotificationsAPI({ apiClient: api }),
        broker              : new BrokerAPI({ apiClient: api }),
        cameras             : new CamerasAPI({ apiClient: api }),
        updateService       : new UpdateServiceAPI({ apiClient: apiUpdater }),
        references          : new ReferencesAPI({ apiClient: api }),
        utils               : new UtilsAPI({ apiClient: api }),
        workspace           : new WorkspaceAPI({ apiClient: api })
    };
}

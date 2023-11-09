import { MODALS_BY_NAME  as TEMPLATER_MODALS } from 'templater-ui/src/components/modals/ModalContainer/modals';

import AccessSubjectToken       from '../AccessSubjectToken';
import AccessTokenReader        from '../AccessTokenReader';
import AccessReadersGroup       from '../AccessReadersGroup';
import AccessReadersGroups      from '../AccessReadersGroups';
import AccessSubject            from '../AccessSubject';
import AccessSchedule           from '../AccessSchedule';
import AccessSetting            from '../AccessSetting';
import Notifications            from '../Notifications';
import Confirm                  from '../Confirm';
import DeviceSettings           from '../DeviceSettings';
import CameraStream             from '../CameraStream';
import Camera                   from '../Camera';
import AccessSubjectTokens      from '../AccessSubjectTokens';
import NotificationSettings     from '../NotificationSettings';
import AccessLogMedia           from '../AccessLogMedia';

export const MODALS_BY_NAME = {
    ...TEMPLATER_MODALS,
    confirm              : Confirm,
    accessSubjectToken   : AccessSubjectToken,
    accessTokenReader    : AccessTokenReader,
    accessReadersGroup   : AccessReadersGroup,
    accessReadersGroups  : AccessReadersGroups,
    accessSubject        : AccessSubject,
    accessSchedule       : AccessSchedule,
    accessSetting        : AccessSetting,
    notifications        : Notifications,
    deviceSettings       : DeviceSettings,
    cameraStream         : CameraStream,
    camera               : Camera,
    accessSubjectTokens  : AccessSubjectTokens,
    notificationSettings : NotificationSettings,
    accessLogMedia       : AccessLogMedia
};

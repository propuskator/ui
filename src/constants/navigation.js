import * as ROUTES from './routes';

const NAVIGATION_TABS = [
    {
        title : 'sidebar:Accesses',
        path  : ROUTES.ACCESS_SETTINGS,
        icon  : 'access'
    },
    // {
    //     title : 'sidebar:Spaces',
    //     path  : ROUTES.ACCESS_READERS_GROUPS,
    //     icon  : 'accessGroups'
    // },
    {
        title : 'sidebar:Access points',
        path  : ROUTES.ACCESS_TOKEN_READERS,
        icon  : 'accessPoints'
    },
    {
        title : 'sidebar:Subjects',
        path  : ROUTES.ACCESS_SUBJECTS,
        icon  : 'subjects'
    },
    {
        title : 'sidebar:Tags',
        path  : ROUTES.ACCESS_SUBJECT_TOKENS,
        icon  : 'marks'
    },
    {
        title : 'sidebar:Schedules',
        path  : ROUTES.ACCESS_SCHEDULES,
        icon  : 'time'
    },
    {
        title : 'sidebar:Cameras',
        path  : ROUTES.CAMERAS,
        icon  : 'cameras',
        chip  : {
            text : 'beta'
        }
    },
    {
        title : 'sidebar:Access logs',
        path  : ROUTES.ACCESS_LOGS,
        icon  : 'accessLogs'
    },
    {
        title : 'sidebar:API settings',
        path  : ROUTES.API_SETTINGS,
        icon  : 'apiSettings'
    }
];

export default NAVIGATION_TABS;

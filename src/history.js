import createBrowserHistory from 'history/createBrowserHistory';
import qhistory             from 'qhistory';
import { parse, stringify } from 'templater-ui/src/utils/query';

const history = qhistory(
    createBrowserHistory(),
    stringify,
    parse
);

export default history;

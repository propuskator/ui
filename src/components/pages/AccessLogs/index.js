import { connect }                 from 'react-redux';
import { compose }                 from 'redux';
import { withTranslation }         from 'react-i18next';

import {
    accessLogsListSelector,
    accessLogsAmountSelector,
    accessLogsTotalSelector,
    accessLogsIsFetchingSelector,
    accessLogsFiltersSelector
}                                  from 'Selectors/accessLogs';
import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';
import * as accessLogsActions      from 'Actions/accessLogs';
import * as toastActions           from 'Actions/toasts';

import AccessLogs                  from './AccessLogs';

function mapStateToProps(state) {
    return {
        list       : accessLogsListSelector(state),
        amount     : accessLogsAmountSelector(state),
        total      : accessLogsTotalSelector(state),
        isFetching : accessLogsIsFetchingSelector(state),
        filters    : accessLogsFiltersSelector(state) || {},
        timezone   : workspaceTimezoneSelector(state)
    };
}

const mapDispatchToProps = {
    ...accessLogsActions,
    ...toastActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessLogs);

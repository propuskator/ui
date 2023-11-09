import { connect }                 from 'react-redux';
import { compose }                 from 'redux';
import { withTranslation }         from 'react-i18next';

import {
    accessSchedulesListSelector,
    accessSchedulesAmountSelector,
    accessSchedulesTotalSelector,
    accessSchedulesIsFetchingSelector,
    accessSchedulesFiltersSelector, accessSchedulesVisibleColumnsSelector
} from 'Selectors/accessSchedules';
import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';
import * as viewActions            from 'Actions/view';
import * as accessSchedulesActions from 'Actions/accessSchedules';
import * as toastActions           from 'Actions/toasts';

import AccessSchedules             from './AccessSchedules';

function mapStateToProps(state) {
    return {
        list           : accessSchedulesListSelector(state),
        amount         : accessSchedulesAmountSelector(state),
        total          : accessSchedulesTotalSelector(state),
        isFetching     : accessSchedulesIsFetchingSelector(state),
        filters        : accessSchedulesFiltersSelector(state),
        timezone       : workspaceTimezoneSelector(state),
        visibleColumns : accessSchedulesVisibleColumnsSelector(state)
    };
}


const mapDispatchToProps = {
    ...viewActions,
    ...accessSchedulesActions,
    ...toastActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessSchedules);

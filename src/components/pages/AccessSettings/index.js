import { connect }                 from 'react-redux';
import { compose }                 from 'redux';
import { withTranslation }         from 'react-i18next';

import {
    accessSettingsListSelector,
    accessSettingsAmountSelector,
    accessSettingsTotalSelector,
    accessSettingsIsFetchingSelector,
    accessSettingsFiltersSelector,
    accessSettingsVisibleColumnsSelector
} from 'Selectors/accessSettings';
import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';
import * as accessSettingsActions  from 'Actions/accessSettings';
import * as toastActions           from 'Actions/toasts';
import { openModal }               from 'Actions/view';

import AccessSettings              from './AccessSettings';

function mapStateToProps(state) {
    return {
        list           : accessSettingsListSelector(state),
        amount         : accessSettingsAmountSelector(state),
        total          : accessSettingsTotalSelector(state),
        isFetching     : accessSettingsIsFetchingSelector(state),
        filters        : accessSettingsFiltersSelector(state),
        timezone       : workspaceTimezoneSelector(state),
        visibleColumns : accessSettingsVisibleColumnsSelector(state)
    };
}

const mapDispatchToProps = {
    openModal,
    ...accessSettingsActions,
    ...toastActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessSettings);

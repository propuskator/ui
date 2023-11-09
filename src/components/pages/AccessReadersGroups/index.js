import { connect }                     from 'react-redux';
import { compose }                     from 'redux';
import { withTranslation }             from 'react-i18next';

import {
    accessReadersGroupsListSelector,
    accessReadersGroupAmountSelector,
    accessReadersGroupTotalSelector,
    accessReadersGroupsIsFetchingSelector,
    accessReadersGroupsFiltersSelector
}                                      from 'Selectors/accessReadersGroups';
import {
    workspaceTimezoneSelector
}                                      from 'Selectors/workspace';
import * as viewActions                from 'Actions/view';
import * as toastActions               from 'Actions/toasts';
import * as accessReadersGroupsActions from 'Actions/accessReadersGroups';

import AccessReadersGroups             from './AccessReadersGroups';


function mapStateToProps(state) {
    return {
        list       : accessReadersGroupsListSelector(state),
        amount     : accessReadersGroupAmountSelector(state),
        total      : accessReadersGroupTotalSelector(state),
        isFetching : accessReadersGroupsIsFetchingSelector(state),
        filters    : accessReadersGroupsFiltersSelector(state),
        timezone   : workspaceTimezoneSelector(state)
    };
}

const mapDispatchToProps = {
    ...toastActions,
    ...viewActions,
    ...accessReadersGroupsActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessReadersGroups);

import { connect }                     from 'react-redux';
import { compose }                     from 'redux';
import { withTranslation }             from 'react-i18next';

import {
    accessSubjectTokensListSelector,
    accessSubjectTokensAmountSelector,
    accessSubjectTokensTotalSelector,
    accessSubjectTokensIsFetchingSelector,
    accessSubjectTokensFiltersSelector, accessSubjectTokensVisibleColumnsSelector
} from 'Selectors/accessSubjectTokens';
import {
    workspaceTimezoneSelector
}                                      from 'Selectors/workspace';
import * as viewActions                from 'Actions/view';
import * as accessSubjectTokensActions from 'Actions/accessSubjectTokens';
import * as toastActions               from 'Actions/toasts';

import AccessSubjectTokens             from './AccessSubjectTokens';

function mapStateToProps(state) {
    return {
        list           : accessSubjectTokensListSelector(state),
        amount         : accessSubjectTokensAmountSelector(state),
        total          : accessSubjectTokensTotalSelector(state),
        isFetching     : accessSubjectTokensIsFetchingSelector(state),
        filters        : accessSubjectTokensFiltersSelector(state),
        timezone       : workspaceTimezoneSelector(state),
        visibleColumns : accessSubjectTokensVisibleColumnsSelector(state)
    };
}


const mapDispatchToProps = {
    ...viewActions,
    ...accessSubjectTokensActions,
    ...toastActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessSubjectTokens);

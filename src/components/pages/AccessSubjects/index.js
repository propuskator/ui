import { connect }              from 'react-redux';
import { compose }              from 'redux';
import { withTranslation }      from 'react-i18next';

import {
    accessSubjectsListSelector,
    accessSubjectsAmountSelector,
    accessSubjectsTotalSelector,
    accessSubjectsIsFetchingSelector,
    accessSubjectsFiltersSelector,
    accessSubjectsVisibleColumnsSelector
} from 'Selectors/accessSubjects';
import {
    workspaceTimezoneSelector
}                               from 'Selectors/workspace';
import * as viewActions         from 'Actions/view';
import * as toastActions        from 'Actions/toasts';
import * as subjectsActions     from 'Actions/accessSubjects';

import AccessSubjects           from './AccessSubjects';

function mapStateToProps(state) {
    return {
        list           : accessSubjectsListSelector(state),
        amount         : accessSubjectsAmountSelector(state),
        total          : accessSubjectsTotalSelector(state),
        isFetching     : accessSubjectsIsFetchingSelector(state),
        filters        : accessSubjectsFiltersSelector(state),
        timezone       : workspaceTimezoneSelector(state),
        visibleColumns : accessSubjectsVisibleColumnsSelector(state)
    };
}

const mapDispatchToProps = {
    ...subjectsActions,
    ...toastActions,
    ...viewActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessSubjects);

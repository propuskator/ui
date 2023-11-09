import { connect }                     from 'react-redux';

import {
    accessSubjectTokensListSelector
}                                      from 'Selectors/accessSubjectTokens';
import {
    accessSubjectSelector
}                                      from 'Selectors/accessSubjects';
import {
    fetchAccessReadersGroups,
    clearAccessReadersGroups
}                                      from 'Actions/accessReadersGroups';
import * as subjectsActions            from 'Actions/accessSubjects';
import * as accessSubjectTokensActions from 'Actions/accessSubjectTokens';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessSubject                   from './AccessSubject';


function mapStateToProps(state, ownProps) {
    const { entityId } = ownProps;

    return {
        accessSubjectTokensList : accessSubjectTokensListSelector(state),
        entityData              : accessSubjectSelector(state, entityId) || {}
    };
}

const mapDispatchToProps = {
    fetchAccessReadersGroups,
    clearAccessReadersGroups,
    ...toastActions,
    ...accessSubjectTokensActions,
    ...subjectsActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessSubject));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

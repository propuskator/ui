import { connect }                     from 'react-redux';
import {
    accessReadersGroupsListSelector,
    accessReadersGroupsIsFetchingSelector
}                                      from 'Selectors/accessReadersGroups';
import {
    deleteAccessReadersGroup,
    fetchAccessReadersGroups,
    clearAccessReadersGroups
}                                      from 'Actions/accessReadersGroups';
import { openModal, closeModal }       from 'Actions/view';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessReadersGroups             from './AccessReadersGroups';


function mapStateToProps(state) {
    return {
        list       : accessReadersGroupsListSelector(state),
        isFetching : accessReadersGroupsIsFetchingSelector(state)
    };
}

const mapDispatchToProps = {
    openModal,
    closeModal,
    deleteEntity : deleteAccessReadersGroup,
    clearList    : clearAccessReadersGroups,
    fetchList    : fetchAccessReadersGroups,
    ...toastActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessReadersGroups));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

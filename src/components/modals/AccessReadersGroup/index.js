import { connect }                     from 'react-redux';

import {
    accessTokenReadersListSelector
}                                      from 'Selectors/accessTokenReaders';
import {
    accessReadersGroupSelector
}                                      from 'Selectors/accessReadersGroups';
import {
    fetchAccessTokenReaders
}                                      from 'Actions/accessTokenReaders';
import * as accessReadersGroupsActions from 'Actions/accessReadersGroups';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessReadersGroup               from './AccessReadersGroup';


function mapStateToProps(state, ownProps) {
    const { entityId, initialData = {} } = ownProps;
    const entityData = accessReadersGroupSelector(state, entityId) || {};

    return {
        readersListFromState : accessTokenReadersListSelector(state),
        entityData           : {
            ...entityData,
            ...initialData
        }
    };
}

const mapDispatchToProps = {
    fetchAccessTokenReaders,
    ...toastActions,
    ...accessReadersGroupsActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessReadersGroup));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

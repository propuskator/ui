import { connect }                     from 'react-redux';

import {
    accessReadersGroupsListSelector
}                                      from 'Selectors/accessReadersGroups';
import {
    accessTokenReaderSelector
}                                      from 'Selectors/accessTokenReaders';
import {
    fetchAccessReadersGroups,
    clearAccessReadersGroups
}                                      from 'Actions/accessReadersGroups';
import * as accessTokenReadersActions  from 'Actions/accessTokenReaders';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessTokenReader               from './AccessTokenReader';


function mapStateToProps(state, ownProps) {
    const { entityId, initialData = {} } = ownProps;
    const entityData = accessTokenReaderSelector(state, entityId) || {};

    return {
        accessReadersGroupsList : accessReadersGroupsListSelector(state),
        entityData              : {
            ...entityData,
            ...initialData
        }
    };
}

const mapDispatchToProps = {
    fetchAccessReadersGroups,
    clearAccessReadersGroups,
    ...toastActions,
    ...accessTokenReadersActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessTokenReader));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

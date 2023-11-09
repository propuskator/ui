import { connect }                     from 'react-redux';

import {
    accessSubjectTokenSelector
}                                      from 'Selectors/accessSubjectTokens';
import * as accessSubjectTokensActions from 'Actions/accessSubjectTokens';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import AccessSubjectToken              from './AccessSubjectToken';


function mapStateToProps(state, ownProps) {
    const { entityId, initialData = {} } = ownProps;
    const entityData = accessSubjectTokenSelector(state, entityId) || {};

    return {
        entityData : {
            ...entityData,
            ...initialData
        }
    };
}

const mapDispatchToProps = {
    ...toastActions,
    ...accessSubjectTokensActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessSubjectToken));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

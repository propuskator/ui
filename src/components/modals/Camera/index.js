import { connect }                     from 'react-redux';

import {
    accessTokenReadersListSelector
}                                      from 'Selectors/accessTokenReaders';
import {
    cameraSelector
}                                      from 'Selectors/cameras';
import {
    fetchAccessTokenReaders
}                                      from 'Actions/accessTokenReaders';
import * as camerasActions             from 'Actions/cameras';
import * as toastActions               from 'Actions/toasts';
import withCloseOnEsc                  from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent from '../withAllowTabMoveOnlyInComponent';

import Camera                          from './Camera';


function mapStateToProps(state, ownProps) {
    const { entityId } = ownProps;

    return {
        readersList : accessTokenReadersListSelector(state),
        entityData  : cameraSelector(state, entityId) || {}
    };
}

const mapDispatchToProps = {
    fetchReaders : fetchAccessTokenReaders,
    ...toastActions,
    ...camerasActions
};

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(Camera));

export default connect(mapStateToProps, mapDispatchToProps)(componentWithHOCS);

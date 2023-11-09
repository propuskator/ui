import { connect }                     from 'react-redux';
import { compose }                     from 'redux';
import { withTranslation }             from 'react-i18next';

import {
    camerasListSelector,
    camerasAmountSelector,
    camerasTotalSelector,
    camerasIsFetchingSelector,
    camerasFiltersSelector,
    camerasVisibleColumnsSelector
}                                      from 'Selectors/cameras';
import {
    workspaceTimezoneSelector
}                                      from 'Selectors/workspace';

import * as viewActions                from 'Actions/view';
import * as camerasActions             from 'Actions/cameras';
import * as toastActions               from 'Actions/toasts';

import Cameras                         from './Cameras';

function mapStateToProps(state) {
    return {
        list           : camerasListSelector(state),
        amount         : camerasAmountSelector(state),
        total          : camerasTotalSelector(state),
        isFetching     : camerasIsFetchingSelector(state),
        filters        : camerasFiltersSelector(state),
        timezone       : workspaceTimezoneSelector(state),
        visibleColumns : camerasVisibleColumnsSelector(state)
    };
}


const mapDispatchToProps = {
    ...viewActions,
    ...camerasActions,
    ...toastActions,
    fetchList : camerasActions.fetchCameras
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(Cameras);

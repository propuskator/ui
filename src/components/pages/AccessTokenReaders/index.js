import { connect }                    from 'react-redux';
import { compose }                    from 'redux';
import { withTranslation }            from 'react-i18next';

import {
    accessTokenReadersListSelector,
    accessTokenReadersAmountSelector,
    accessTokenReadersTotalSelector,
    accessTokenReadersIsFetchingSelector,
    accessTokenReadersFiltersSelector, accessTokenReadersVisibleColumnsSelector
} from 'Selectors/accessTokenReaders';
import {
    workspaceTimezoneSelector
}                                     from 'Selectors/workspace';

import * as viewActions               from 'Actions/view';
import * as toastActions              from 'Actions/toasts';
import * as accessTokenReadersActions from 'Actions/accessTokenReaders';

import AccessTokenReaders             from './AccessTokenReaders';


function mapStateToProps(state) {
    return {
        list           : accessTokenReadersListSelector(state),
        amount         : accessTokenReadersAmountSelector(state),
        total          : accessTokenReadersTotalSelector(state),
        isFetching     : accessTokenReadersIsFetchingSelector(state),
        filters        : accessTokenReadersFiltersSelector(state),
        devices        : state?.devices,
        timezone       : workspaceTimezoneSelector(state),
        visibleColumns : accessTokenReadersVisibleColumnsSelector(state)
    };
}

const mapDispatchToProps = {
    ...toastActions,
    ...viewActions,
    ...accessTokenReadersActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccessTokenReaders);

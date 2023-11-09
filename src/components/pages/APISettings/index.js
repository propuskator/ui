import { connect }                     from 'react-redux';
import { compose }                     from 'redux';
import { withTranslation }             from 'react-i18next';

import {
    apiSettingsSelector,
    apiSettingsIsFetchingSelector
}                                      from 'Selectors/apiSettings';
import { accountLoginSelector }        from 'Selectors/accountSettings';
import * as toastActions               from 'Actions/toasts';
import * as apiSettingsActions         from 'Actions/apiSettings';
import { openModal, closeModal }       from 'Actions/view';

import APISettings                     from './APISettings';

function mapStateToProps(state, ownProps) {
    const data = apiSettingsSelector(state);
    const { i18n } = ownProps;
    const languageId = i18n?.language;

    return {
        isFetching : apiSettingsIsFetchingSelector(state),
        dataAPI    : data,
        login      : accountLoginSelector(state),
        languageId
    };
}

const mapDispatchToProps = {
    openModal,
    closeModal,
    ...toastActions,
    ...apiSettingsActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(APISettings);

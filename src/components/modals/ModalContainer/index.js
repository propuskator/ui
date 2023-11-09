import { connect }         from 'react-redux';
import { compose }         from 'redux';
import { withTranslation } from 'react-i18next';

import ModalContainer      from 'templater-ui/src/components/modals/ModalContainer';

import {
    closeModal,
    openModal
}                          from 'Actions/view.js';

import {
    MODALS_BY_NAME
}                          from './modals';

function mapStateToProps(state) {
    return {
        list   : state.view.modals,
        modals : MODALS_BY_NAME
    };
}

const mapDispatchToProps = {
    closeModal,
    openModal
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(ModalContainer);

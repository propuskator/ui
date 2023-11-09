import { connect }                from 'react-redux';
import { compose }                from 'redux';
import { withTranslation }        from 'react-i18next';

import ToastsContainer            from 'templater-ui/src/components/shared/ToastsContainer';

import {
    addToast,
    removeToast,
    removeToastByKey
}                                 from 'Actions/toasts';
import {
    networkStatusUpdate
}                                 from 'Actions/broker';

function mapStateToProps(state) {
    return {
        toasts : state.toasts
    };
}

const mapDispatchToProps = {
    addToast,
    removeToast,
    removeToastByKey,
    networkStatusUpdate
};


export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(ToastsContainer);

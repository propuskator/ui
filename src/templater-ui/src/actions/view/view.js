import ActionsBase from './../base';
import {
    OPEN_MODAL,
    CLOSE_MODAL,
    CLOSE_ALL_MODALS
} from './../../constants/actions/view';

export default class View extends ActionsBase {
    constructor(...args) {
        super(...args);

        this.openModal      = this.openModal.bind(this);
        this.closeModal     = this.closeModal.bind(this);
        this.closeAllModals = this.closeAllModals.bind(this);
    }

    openModal(name, props = {}) {
        return {
            type    : OPEN_MODAL,
            payload : {
                name,
                props
            }
        };
    }

    closeModal(name, closeAll) {
        return (dispatch, getState) => {
            if (closeAll) return dispatch(this.closeAllModals());

            const modals = getState().view.modals || [];
            const modalIndex =  [ ...modals ].reverse().findIndex(modal => modal.name === name);
            /* eslint-disable-next-line no-magic-numbers */
            const lastModalIndex = modalIndex > -1 ? modals.length - 1 - modalIndex : modalIndex;

            dispatch({
                type    : CLOSE_MODAL,
                payload : {
                    modals : modals.filter((modal, index) => lastModalIndex !== index)
                }
            });
        };
    }

    closeAllModals() {
        return (dispatch) => {
            dispatch({ type: CLOSE_ALL_MODALS });
        };
    }
}

import { connect }               from 'react-redux';

import { openModal, closeModal } from 'Actions/view';
import { addToast }              from 'Actions/toasts';
import {
    patchAccessSubject,
    fetchAccessSubjects,
    deleteAccessSubject,
    inviteAccessSubject
}                                from 'Actions/accessSubjects';

import Table                     from './Table';


const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : patchAccessSubject,
    fetchItems : fetchAccessSubjects,
    deleteItem : deleteAccessSubject,
    inviteItem : inviteAccessSubject,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);

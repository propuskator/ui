import { connect }               from 'react-redux';

import { openModal, closeModal } from 'Actions/view';
import {
    updateAccessSubjectToken,
    fetchAccessSubjectTokens,
    deleteAccessSubjectToken
}                                from 'Actions/accessSubjectTokens';
import { addToast }              from 'Actions/toasts';

import Table                     from './Table';


const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : updateAccessSubjectToken,
    fetchItems : fetchAccessSubjectTokens,
    deleteItem : deleteAccessSubjectToken,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);

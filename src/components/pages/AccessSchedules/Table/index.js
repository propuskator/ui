import { connect }               from 'react-redux';

import {
    fetchAccessSchedules,
    updateAccessSchedule,
    deleteAccessSchedule
}                                from 'Actions/accessSchedules';
import { openModal, closeModal } from 'Actions/view';
import { addToast }              from 'Actions/toasts';

import Table                     from './Table';


const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : updateAccessSchedule,
    fetchItems : fetchAccessSchedules,
    deleteItem : deleteAccessSchedule,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);


import { connect }               from 'react-redux';

import { openModal, closeModal } from 'Actions/view';
import {
    updateCamera,
    fetchCameras,
    deleteCamera
}                                from 'Actions/cameras';
import { addToast }              from 'Actions/toasts';

import Table                     from './Table';


const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : updateCamera,
    fetchItems : fetchCameras,
    deleteItem : deleteCamera,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);

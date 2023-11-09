import { connect }                  from 'react-redux';

import {
    fetchAccessSettings,
    patchAccessSetting,
    deleteAccessSetting
}                                   from 'Actions/accessSettings';
import { fetchAccessReadersGroups } from 'Actions/accessReadersGroups';
import { openModal, closeModal }    from 'Actions/view';
import { addToast }                 from 'Actions/toasts';

import Table                        from './Table';


const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : patchAccessSetting,
    fetchItems : fetchAccessSettings,
    deleteItem : deleteAccessSetting,
    fetchAccessReadersGroups,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);


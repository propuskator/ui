import { connect }                  from 'react-redux';

import { openModal, closeModal }    from 'Actions/view';
import { addToast }                 from 'Actions/toasts';
import {
    updateAccessReadersGroup,
    fetchAccessReadersGroups,
    deleteAccessReadersGroup
}                                   from 'Actions/accessReadersGroups';

import Table                        from './Table';


const mapDispatchToProps = {
    openModal,
    closeModal,
    updateItem : updateAccessReadersGroup,
    fetchItems : fetchAccessReadersGroups,
    deleteItem : deleteAccessReadersGroup,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);

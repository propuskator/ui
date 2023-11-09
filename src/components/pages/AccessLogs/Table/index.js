import { connect }               from 'react-redux';

import { openModal }             from 'Actions/view';
import { addToast }              from 'Actions/toasts';

import Table                     from './Table';

const mapDispatchToProps = {
    openModal,
    addToast
};

export default connect(null, mapDispatchToProps)(Table);

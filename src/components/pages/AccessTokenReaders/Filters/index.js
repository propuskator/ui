import { connect }              from 'react-redux';

import {
    fetchAccessReadersGroups
}                               from 'Actions/accessReadersGroups';

import Filters                  from './Filters';


// function mapStateToProps(state) {
//     return {
//     };
// }

const mapDispatchToProps = {
    fetchAccessReadersGroups
};

export default connect(null, mapDispatchToProps)(Filters);

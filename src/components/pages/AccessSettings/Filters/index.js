import { connect }              from 'react-redux';

import {
    fetchAccessReadersGroups
}                               from 'Actions/accessReadersGroups';
import {
    fetchAccessSchedules
}                               from 'Actions/accessSchedules';
import {
    fetchAccessTokenReaders
}                               from 'Actions/accessTokenReaders';

import Filters                  from './Filters';


// function mapStateToProps(state) {
//     return {
//     };
// }

const mapDispatchToProps = {
    fetchAccessReadersGroups,
    fetchAccessSchedules,
    fetchAccessTokenReaders
};

export default connect(null, mapDispatchToProps)(Filters);

import { connect }                 from 'react-redux';

import { fetchAccessTokenReaders } from 'Actions/accessTokenReaders';

import Filters                     from './Filters';

// function mapStateToProps(state) {
//     return {
//     };
// }

const mapDispatchToProps = {
    fetchAccessTokenReaders
};

export default connect(null, mapDispatchToProps)(Filters);

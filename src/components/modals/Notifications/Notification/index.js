import { connect }                     from 'react-redux';

import { openModal }                   from 'Actions/view';
import {
    fetchAccessSubjectTokens
}                                      from 'Actions/accessSubjectTokens';
import {
    fetchAccessTokenReaders
}                                      from 'Actions/accessTokenReaders';
import {
    fetchAccessSubjects
}                                      from 'Actions/accessSubjects';

import Notification                    from './Notification';

// function mapStateToProps(state) {
//     return {
//     };
// }

const mapDispatchToProps = {
    openModal,
    fetchAccessSubjectTokens,
    fetchAccessTokenReaders,
    fetchAccessSubjects
};

export default connect(null, mapDispatchToProps)(Notification);

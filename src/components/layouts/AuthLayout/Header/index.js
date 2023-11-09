import { connect }              from 'react-redux';
import * as sessionActions      from 'Actions/sessions';
import {
    accountLoginSelector,
    accountAvatarSelector
}                               from 'Selectors/accountSettings';

import Header                   from './Header';


function mapStateToProps(state) {
    return {
        userLogin     : accountLoginSelector(state),
        userAvatarUrl : accountAvatarSelector(state)
    };
}

const mapDispatchToProps = {
    ...sessionActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

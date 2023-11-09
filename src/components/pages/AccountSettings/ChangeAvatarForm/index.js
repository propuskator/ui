import { connect }                     from 'react-redux';

import * as toastActions               from 'Actions/toasts';
import * as accountSettingsActions     from 'Actions/accountSettings';
import { accountAvatarSelector }       from 'Selectors/accountSettings';

import ChangeAvatarForm                from './ChangeAvatarForm';


function mapStateToProps(state) {
    return {
        avatar : accountAvatarSelector(state)
    };
}

const mapDispatchToProps = {
    ...toastActions,
    ...accountSettingsActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeAvatarForm);

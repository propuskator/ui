import { connect }                      from 'react-redux';

import * as toastActions                from 'Actions/toasts';
import { updateWorkspaceSettings }      from 'Actions/workspace';

import { workspaceTimezoneSelector }    from 'Selectors/workspace';

import ChangeTimezoneForm               from './ChangeTimezoneForm';

function mapStateToProps(state) {
    return {
        timezone : workspaceTimezoneSelector(state)
    };
}

const mapDispatchToProps = {
    ...toastActions,
    updateWorkspaceSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTimezoneForm);

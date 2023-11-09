import { connect }                  from 'react-redux';

import SystemInfo                   from 'templater-ui/src/components/pages/AccountSettings/SystemInfo';

import * as localStorageUtils       from 'templater-ui/src/utils/helpers/localStorage';
import { UPDATE_INFO }              from 'templater-ui/src/constants/localStorage';

import { openModal }                from 'Actions/view';
import { fetchChangelog }           from 'Actions/updater';

function mapStateToProps(state) {
    return {
        allowNotify : localStorageUtils.getData(UPDATE_INFO)?.allowNotify,
        updaterData : state?.updater
    };
}

const mapDispatchToProps = {
    openModal,
    fetchChangelog
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemInfo);

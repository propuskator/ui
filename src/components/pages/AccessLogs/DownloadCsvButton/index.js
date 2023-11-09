import { connect }                 from 'react-redux';

import {
    accessLogsIsLoadingCsvSelector
}                                  from 'Selectors/accessLogs';
import { fetchAccessLogsCsv }      from 'Actions/accessLogs';

import DownloadCsvButton           from '../../../shared/DownloadCsvButton';

function mapStateToProps(state) {
    return {
        isProcessing : accessLogsIsLoadingCsvSelector(state)
    };
}

const mapDispatchToProps = {
    onClick : fetchAccessLogsCsv
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadCsvButton);

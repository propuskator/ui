import { connect }                     from 'react-redux';

import {
    accessLogsIsLoadingCsvSelector
}                                      from 'Selectors/accessLogs';
import { fetchAccessSubjectTokensCsv } from 'Actions/accessSubjectTokens';

import DownloadCsvButton               from '../../../shared/DownloadCsvButton';

function mapStateToProps(state) {
    return {
        isProcessing : accessLogsIsLoadingCsvSelector(state)
    };
}

const mapDispatchToProps = {
    onClick : fetchAccessSubjectTokensCsv
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadCsvButton);

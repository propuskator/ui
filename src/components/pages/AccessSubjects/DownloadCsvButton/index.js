import { connect }                 from 'react-redux';

import {
    accessSubjectsIsLoadingCsvSelector
}                                  from 'Selectors/accessSubjects';
import { fetchAccessSubjectsCsv }  from 'Actions/accessSubjects';

import DownloadCsvButton           from '../../../shared/DownloadCsvButton';

function mapStateToProps(state) {
    return {
        isProcessing : accessSubjectsIsLoadingCsvSelector(state)
    };
}

const mapDispatchToProps = {
    onClick : fetchAccessSubjectsCsv
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadCsvButton);

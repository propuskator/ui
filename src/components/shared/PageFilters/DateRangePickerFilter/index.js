import { connect }                 from 'react-redux';

import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';

import DateRangePickerFilter       from './DateRangePickerFilter';

function mapStateToProps(state) {
    return {
        timezone : workspaceTimezoneSelector(state)
    };
}

// const mapDispatchToProps = {
// };

export default connect(mapStateToProps, null)(DateRangePickerFilter);

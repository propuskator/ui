import { connect }                 from 'react-redux';
import { compose }                 from 'redux';
import { withTranslation }         from 'react-i18next';

import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';

import DateRange                   from './DateRange';

function mapStateToProps(state, ownProps) {
    const { i18n } = ownProps;
    const languageId = i18n?.language;

    return {
        timezone : workspaceTimezoneSelector(state),
        languageId
    };
}

// const mapDispatchToProps = {
// };

export default compose(
    withTranslation(),
    connect(mapStateToProps, null)
)(DateRange);

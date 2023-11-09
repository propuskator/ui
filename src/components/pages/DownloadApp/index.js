import { connect }                 from 'react-redux';
import { compose }                 from 'redux';
import { withTranslation }         from 'react-i18next';

import DownloadApp                 from './DownloadApp';

function mapStateToProps(state, ownProps) {
    const { i18n } = ownProps;
    const languageId = i18n?.language;

    return {
        languageId
    };
}

// const mapDispatchToProps = {
// };

export default compose(
    withTranslation(),
    connect(mapStateToProps, null)
)(DownloadApp);

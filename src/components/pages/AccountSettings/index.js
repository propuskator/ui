import { connect }              from 'react-redux';
import { compose }              from 'redux';
import { withTranslation }      from 'react-i18next';

import { changeLanguage }       from 'I18next/utils';

import { openModal }            from 'Actions/view';
import { addToast }             from 'Actions/toasts';
import { sendReport }           from 'Actions/accountSettings';

import AccountSettings from './AccountSettings';


function mapStateToProps(state, ownProps) {
    const { i18n } = ownProps;
    const languageId = i18n?.language;

    return {
        languageId,
        changeLanguage : (langId) => changeLanguage(i18n, langId)
    };
}

const mapDispatchToProps = {
    openModal,
    addToast,
    sendReport
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps)
)(AccountSettings);

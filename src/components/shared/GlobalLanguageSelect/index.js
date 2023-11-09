import { connect }              from 'react-redux';
import { compose }              from 'redux';
import { withTranslation }      from 'react-i18next';

import { changeLanguage }       from 'I18next/utils';
import { LANGUAGES_DATA }       from 'I18next/data';

import GlobalLanguageSelect     from './GlobalLanguageSelect';

function mapStateToProps(state, ownProps) {
    const { i18n } = ownProps;
    const languageId = i18n?.language;

    return {
        languageId,
        changeLanguage : langId => changeLanguage(i18n, langId),
        languages      : Object.entries(LANGUAGES_DATA).map(([ value, { contraction } ]) =>
            ({ value,  label: contraction?.toUpperCase() }))
    };
}

export default compose(
    withTranslation(),
    connect(mapStateToProps, null)
)(GlobalLanguageSelect);

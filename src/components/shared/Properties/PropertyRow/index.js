import { connect }           from 'react-redux';
import { compose }           from 'redux';
import { withTranslation }   from 'react-i18next';

import { setAttribute }      from 'Actions/homie';
import { addToast }          from 'Actions/toasts';
import {
    addDisplayedTopic,
    deleteDisplayedTopic
}                            from 'Actions/accessTokenReaders';

import PropertyRow           from './PropertyRow';


const mapDispatchToProps = {
    setAttribute,
    addToast,
    addDisplayedTopic,
    deleteDisplayedTopic
};

export default compose(
    withTranslation(),
    connect(null, mapDispatchToProps)
)(PropertyRow);

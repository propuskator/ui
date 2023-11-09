import { connect }                      from 'react-redux';

import {
    fetchNotificationsList
}                                       from 'Actions/notifications';
import { addToast }                     from 'Actions/toasts';
import { createAccessSubjectTokens }    from 'Actions/accessSubjectTokens';
import { convertCsvToJson }             from 'Actions/utils';

import withCloseOnEsc                   from '../withCloseOnEsc';
import withAllowTabMoveOnlyInComponent  from '../withAllowTabMoveOnlyInComponent';

import AccessSubjectTokens              from './AccessSubjectTokens';

const componentWithHOCS = withAllowTabMoveOnlyInComponent(withCloseOnEsc(AccessSubjectTokens));

const mapDispatchToProps = {
    addToast,
    createAccessSubjectTokens,
    fetchNotificationsList,
    convertCsvToJson
};

export default connect(null, mapDispatchToProps)(componentWithHOCS);


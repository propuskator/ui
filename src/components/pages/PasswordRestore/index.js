import React                      from 'react';
import { connect }                from 'react-redux';
import { compose }                from 'redux';
import { withTranslation }        from 'react-i18next';

import withRedirect               from 'templater-ui/src/components/pages/withRedirect';
import PasswordRestore            from 'templater-ui/src/components/pages/PasswordRestore';

import { isUserLoggedInSelector } from 'Selectors/sessions';
import * as sessionActions        from 'Actions/sessions';
import { addToast }               from 'Actions/toasts';
import * as ROUTES                from 'Constants/routes';

import SvgIcon                    from 'Base/SvgIcon';
import GlobalLanguageSelect       from 'Shared/GlobalLanguageSelect';

import styles               from './PasswordRestore.less';

function mapStateToProps(state, ownProps) {
    const { t, i18n } = ownProps;

    const LOGO_TYPE_BY_LANG = {
        'en' : 'logoEN',
        'ru' : 'logoRU',
        'uk' : 'logoUA'
    };

    const currentLang = i18n.language;

    return {
        renderCustomContent : () => <GlobalLanguageSelect />,
        isRedirect          : isUserLoggedInSelector(state),
        urlToRedirect       : ROUTES.INITIAL_APP_ROUTE,
        logoProps           : {
            component : SvgIcon,
            type      : LOGO_TYPE_BY_LANG[currentLang],
            className : styles.logo,
            color     : ''
        },
        theme    : 'orange',
        emailKey : 'login',
        fields   : [ {
            key   : 'login',
            label : t('Enter your email'),
            type  : 'string',
            props : {
                autoFocus      : true,
                autoCapitalize : false
            }
        } ]
    };
}

const mapDispatchToProps = {
    ...sessionActions,
    addToast
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
    withRedirect
)(PasswordRestore);

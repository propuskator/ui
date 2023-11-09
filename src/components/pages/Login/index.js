import React                      from 'react';
import { connect }                from 'react-redux';
import { compose }                from 'redux';
import { withTranslation }        from 'react-i18next';

import withRedirect               from 'templater-ui/src/components/pages/withRedirect';
import Login                      from 'templater-ui/src/components/pages/Login';

import * as sessionActions        from 'Actions/sessions';
import { isUserLoggedInSelector } from 'Selectors/sessions';
import * as ROUTES                from 'Constants/routes';

import SvgIcon                    from 'Base/SvgIcon';
import GlobalLanguageSelect       from 'Shared/GlobalLanguageSelect';


import styles               from './Login.less';


function mapStateToProps(state, ownProps) {
    const { t, i18n } = ownProps;

    const LOGO_TYPE_BY_LANG = {
        'en' : 'logoEN',
        'ru' : 'logoRU',
        'uk' : 'logoUA'
    };

    const currentLang = i18n.language;

    return {
        languageId          : i18n?.language,
        renderCustomContent : () => <GlobalLanguageSelect />,
        isRedirect          : isUserLoggedInSelector(state),
        urlToRedirect       : ROUTES.INITIAL_APP_ROUTE,
        logoProps           : {
            component : SvgIcon,
            type      : LOGO_TYPE_BY_LANG[currentLang],
            className : styles.logo,
            color     : ''
        },
        locale : 'ru',
        theme  : 'orange',
        fields : [ {
            key   : 'login',
            label : t('Login'),
            type  : 'string',
            props : {
                autoFocus      : true,
                autoCapitalize : false
            }
        }, {
            key   : 'password',
            label : t('Password'),
            type  : 'password',
            props : { }
        } ]
    };
}

const mapDispatchToProps = {
    ...sessionActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
    withRedirect
)(Login);

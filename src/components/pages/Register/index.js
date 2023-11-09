import React                      from 'react';
import { connect }                from 'react-redux';
import { compose }                from 'redux';
import { withTranslation }        from 'react-i18next';

import withRedirect               from 'templater-ui/src/components/pages/withRedirect';
import Register                   from 'templater-ui/src/components/pages/Register';

import * as sessionActions        from 'Actions/sessions';
import { isUserLoggedInSelector } from 'Selectors/sessions';
import * as ROUTES                from 'Constants/routes';
import { PASSWORD_POLICY }        from 'Constants/index';

import SvgIcon                    from 'Base/SvgIcon';
import GlobalLanguageSelect       from 'Shared/GlobalLanguageSelect';

import styles               from './Register.less';


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
        locale : 'ru',
        theme  : 'orange',
        fields : [ {
            key   : 'workspace',
            label : t('Workspace'),
            type  : 'inputWithInfo',
            props : {
                autoFocus      : true,
                autoCapitalize : false,
                tooltipContent : t('Workspace is a unique name')
            }
        }, {
            key   : 'login',
            label : t('Email'),
            type  : 'string',
            props : {
                autoCapitalize : false
            }
        }, {
            key   : 'password',
            label : t('Password'),
            type  : 'passwordStrength',
            props : {
                observeFields   : [ 'login' ],
                extraDictionary : [ 'propuskator.com', 'propuskator-cloud' ]
            }
        }, {
            key   : 'passwordConfirm',
            label : t('Confirm Password'),
            type  : 'password',
            props : { }
        } ],
        passwordPolicy : t(PASSWORD_POLICY)
    };
}

const mapDispatchToProps = {
    ...sessionActions
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
    withRedirect
)(Register);

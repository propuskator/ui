import { connect }                from 'react-redux';
import { compose }                from 'redux';
import { withTranslation }        from 'react-i18next';

import withRedirect               from 'templater-ui/src/components/pages/withRedirect';
import PasswordChange             from 'templater-ui/src/components/pages/PasswordChange';

import { isUserLoggedInSelector } from 'Selectors/sessions';
import * as sessionActions        from 'Actions/sessions';
import * as ROUTES                from 'Constants/routes';
import SvgIcon                    from 'Base/SvgIcon';

import styles                     from './PasswordChange.less';


function mapStateToProps(state, ownProps) {
    const { t, i18n } = ownProps;

    const LOGO_TYPE_BY_LANG = {
        'en' : 'logoEN',
        'ru' : 'logoRU',
        'uk' : 'logoUA'
    };

    const currentLang = i18n.language;

    return {
        isRedirect    : isUserLoggedInSelector(state),
        urlToRedirect : ROUTES.INITIAL_APP_ROUTE,
        logoProps     : {
            component : SvgIcon,
            type      : LOGO_TYPE_BY_LANG[currentLang],
            className : styles.logo,
            color     : ''
        },
        theme  : 'orange',
        fields : [ {
            key   : 'password',
            label : t('New password'),
            type  : 'passwordStrength',
            props : {
                autoFocus      : true,
                autoCapitalize : false
            }
        }, {
            key   : 'passwordConfirm',
            label : t('Confirm Password'),
            type  : 'password',
            props : {}
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
)(PasswordChange);

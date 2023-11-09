import React, { useCallback }          from 'react';
import { connect }                     from 'react-redux';

import MainInfo                        from 'templater-ui/src/components/pages/AccountSettings/MainInfo';

import {
    accountLoginSelector,
    accountWorkspaceSelector
}                                      from 'Selectors/accountSettings';

function MainInfoWrapper(props) {
    const getConfiguration = useCallback(({ values, handleChangeLanguage, lang, t }) => ({
        name   : 'mainInfo',
        fields : [
            {
                name  : 'login',
                type  : 'copyText',
                title : t('Login'),
                text  : values?.login,
                props : {
                    t
                }
            }, {
                name  : 'workspace',
                type  : 'copyText',
                title : t('Workspace'),
                text  : values?.workspace,
                props : {
                    t
                }
            }, {
                name    : 'lang',
                type    : 'dropdown',
                label   : t('Language'),
                default : '',
                props   : {
                    options : [ {
                        label : t('English'),
                        value : 'en'
                    }, {
                        label : t('Russian'),
                        value : 'ru'
                    }, {
                        label : t('Ukrainian'),
                        value : 'uk'
                    } ],
                    onChange     : handleChangeLanguage,
                    value        : lang,
                    withClear    : false,
                    withKeyboard : false,
                    isRequired   : true
                }
            }
        ]
    }), []);

    return (
        <MainInfo
            {...props}
            getConfiguration = {getConfiguration}
        />
    );
}

function mapStateToProps(state) {
    return {
        login     : accountLoginSelector(state),
        workspace : accountWorkspaceSelector(state)
    };
}

export default connect(mapStateToProps, null)(MainInfoWrapper);

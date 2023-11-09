import React, {
    useMemo,
    useState
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import CustomForm         from '../../../shared/CustomForm';
// import SvgIcon            from '../../../base/SvgIcon';

import styles             from './MainInfo.less';

const cx = classnames.bind(styles);

function MainInfo(props) {
    const { login, workspace, changeLanguage, languageId, t } = props;

    const [ lang, setLang ] = useState(languageId);

    function handleChangeLanguage({ value } = {}) {
        if (changeLanguage) changeLanguage(value);

        setLang(value);
    }

    const mainInfoCN = cx(styles.MainInfo);

    return (
        <div className = {mainInfoCN}>
            <CustomForm
                className     = {styles.mainInfoForm}
                configuration = {useMemo(() => ({
                    name   : 'mainInfo',
                    fields : [
                        {
                            name  : 'login',
                            type  : 'copyText',
                            title : t('Login'),
                            text  : login,
                            props : {
                                t
                            }
                        }, {
                            name  : 'workspace',
                            type  : 'copyText',
                            title : t('Workspace'),
                            text  : workspace,
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
                                } ],
                                onChange     : handleChangeLanguage,
                                value        : lang,
                                withClear    : false,
                                withKeyboard : false,
                                withError    : false,
                                isRequired   : true,
                                classes      : {
                                    value : styles.dropdownValue
                                }
                            }
                        }
                    ]
                }), [ workspace, login, lang ])}
            />
        </div>
    );
}

MainInfo.propTypes = {
    login          : PropTypes.string,
    workspace      : PropTypes.string,
    t              : PropTypes.func,
    changeLanguage : PropTypes.func,
    languageId     : PropTypes.string
};

MainInfo.defaultProps = {
    login          : '',
    workspace      : '',
    t              : (text) => text,
    changeLanguage : void 0,
    languageId     : void 0
};

export default React.memo(MainInfo);


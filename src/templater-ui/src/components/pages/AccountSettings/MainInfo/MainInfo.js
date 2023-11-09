import React, {
    useMemo,
    useState
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import CustomForm         from '../../../shared/CustomForm';

import { getDefaultConfiguration } from './data';

import styles                      from './MainInfo.less';

const cx = classnames.bind(styles);

function MainInfo(props) {
    const { className, changeLanguage, languageId, t, getConfiguration, ...values } = props;

    const [ lang, setLang ] = useState(languageId);

    const formConfiguration = useMemo(() =>
        getConfiguration
            ? getConfiguration({ values, handleChangeLanguage, lang, t })
            : getDefaultConfiguration({ values, handleChangeLanguage, lang, t }), [ lang ]);

    function handleChangeLanguage({ value } = {}) {
        if (changeLanguage) changeLanguage(value);

        setLang(value);
    }

    const mainInfoCN = cx(styles.MainInfo, { [className]: className });

    return (
        <div className = {mainInfoCN}>
            <CustomForm
                className     = {styles.mainInfoForm}
                t             = {t}
                configuration = {formConfiguration}
            />
        </div>
    );
}

MainInfo.propTypes = {
    values           : PropTypes.arrayOf({}),
    className        : PropTypes.string,
    languageId       : PropTypes.string,
    changeLanguage   : PropTypes.func,
    getConfiguration : PropTypes.func,
    t                : PropTypes.func
};

MainInfo.defaultProps = {
    values           : void 0,
    className        : '',
    languageId       : void 0,
    changeLanguage   : void 0,
    getConfiguration : void 0,
    t                : (text) => text
};

export default React.memo(MainInfo);

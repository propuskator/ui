import React, { useCallback }   from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import DropdownLanguages        from 'templater-ui/src/components/base/Dropdown/DropdownLanguages';

import styles                   from './GlobalLanguageSelect.less';

const cx = classnames.bind(styles);

function GlobalLanguageSelect(props) {
    const { languages, languageId, changeLanguage, t } = props;

    const handleChangeLanguage = useCallback(({ value }) => {
        if (changeLanguage) changeLanguage(value);
    }, [ changeLanguage ]);

    return (
        <div className={cx(styles.GlobalLanguageSelect)}>
            <DropdownLanguages
                options   = {languages}
                onChange  = {handleChangeLanguage}
                value     = {languageId}
                t         = {t}
            />
        </div>
    );
}

GlobalLanguageSelect.propTypes = {
    languages      : PropTypes.array,
    languageId     : PropTypes.string,
    changeLanguage : PropTypes.func,
    t              : PropTypes.func
};

GlobalLanguageSelect.defaultProps = {
    languages      : [],
    languageId     : void 0,
    changeLanguage : void 0,
    t              : t => t
};

export default GlobalLanguageSelect;

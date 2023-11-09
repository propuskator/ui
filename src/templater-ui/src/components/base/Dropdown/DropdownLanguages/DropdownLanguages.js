import React, { useCallback }   from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Dropdown                 from '../Dropdown';
import SvgIcon                  from '../../SvgIcon';

import styles                   from './DropdownLanguages.less';

const cx = classnames.bind(styles);

function DropdownLanguages(props) {
    const { value, onChange, classes } = props;

    const dropdownLanguagesCN = cx(styles.DropdownLanguages, {
        [props?.className] : props?.className
    });

    const renderDropdownIcon = useCallback(() => (
        <SvgIcon
            className = {styles.dropdownIcon}
            type      = 'global'
            color     = 'greyDark'
        />
    ), []);

    return (
        <div className={dropdownLanguagesCN}>
            <Dropdown
                {...props}
                className = {styles.dropdown}
                onChange  = {onChange}
                classes   = {{
                    labelWrapper : styles.labelWrapper,
                    inputWrapper : styles.inputWrapper,
                    input        : styles.input,
                    dropdownMenu : styles.dropdownMenu,
                    ...classes
                }}
                value        = {value}
                withClear    = {false}
                withError    = {false}
                withKeyboard = {false}
                isRequired   = {false}
                renderStartAdornment  = {renderDropdownIcon}
            />
        </div>
    );
}

DropdownLanguages.propTypes = {
    value    : PropTypes.string,
    onChange : PropTypes.func.isRequired,
    classes  : PropTypes.shape({})
};

DropdownLanguages.defaultProps = {
    value   : '',
    classes : void 0
};

export default DropdownLanguages;

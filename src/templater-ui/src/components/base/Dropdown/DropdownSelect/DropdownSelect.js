import React                    from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Dropdown                 from '../Dropdown';
import IconButton               from '../../IconButton';
import CheckBox                 from '../../Checkbox/CheckboxSquared';
import Typography               from '../../Typography';

import styles                   from './DropdownSelect.less';

const cx = classnames.bind(styles);

function DropdownSelect(props) {
    const { className, value, options, onChange } = props;

    const dropdownSelectCN = cx(styles.DropdownSelect, [ className ]);

    function renderOption(_item, { label, isSelected } = {}) {
        return (
            <div className={styles.option}>
                <CheckBox
                    className = {styles.optionCheckbox}
                    size      = 'M'
                    value     = {isSelected}
                />
                <Typography
                    className = {styles.optionLabel}
                    variant = 'body1'
                >
                    {label}
                </Typography>
            </div>
        );
    }

    function renderEndAdornment() {
        return (
            <IconButton
                className = {styles.dropdownIcon}
                iconType  = 'visible'
            />
        );
    }

    return (
        <div className={dropdownSelectCN}>
            <Dropdown
                {...props}
                value        = {value}
                options      = {options}
                withClear    = {false}
                withError    = {false}
                withChip     = {false}
                withKeyboard = {false}
                isRequired   = {false}
                className    = {styles.dropdown}
                onChange     = {onChange}
                classes      = {{
                    inputWrapper : styles.inputWrapper,
                    input        : styles.input,
                    itemsWrapper : styles.itemsWrapper,
                    itemMenu     : styles.itemMenu
                }}
                renderOption       = {renderOption}
                renderEndAdornment = {renderEndAdornment}
                multiple
            />
        </div>
    );
}

DropdownSelect.propTypes = {
    className : PropTypes.string,
    value     : PropTypes.arrayOf(PropTypes.string),
    options   : PropTypes.array,
    onChange  : PropTypes.func.isRequired
};

DropdownSelect.defaultProps = {
    className : '',
    value     : [],
    options   : []
};

export default DropdownSelect;

import React              from 'react';
import PropTypes          from 'prop-types';

import Dropdown           from '../../Dropdown';
import CriticalValue      from '../../CriticalValue';

import { EMPTY_TEXT }     from '../../../../constants';

import styles             from './List.less';

function List(props) {
    const {
        value, options, name, menuYOffset,
        onChange, isDisabled, isProcessing,
        isSettable, valueClassName, onToggleMenu,
        portalId, maxWidth, themeMode
    } = props;

    const customMenuStyles = {
        position : 'absolute',
        top      : 'unset',
        bottom   : menuYOffset ? menuYOffset : '0',
        left     : '0',
        width    : '100%',
        zIndex   : '2'
    };

    return (
        <div className={styles.List}>
            { isSettable
                ? (
                    <Dropdown
                        name              = {name}
                        value             = {value}
                        defaultValue      = {EMPTY_TEXT}
                        options           = {options}
                        isProcessing      = {isProcessing}
                        disabled          = {isDisabled}
                        withError         = {false}
                        onChange          = {onChange}
                        className         = {styles.dropdownWrapper}
                        classes           = {{
                            input         : styles.dropdownInput,
                            inputWrapper  : styles.dropdownInputWrapper,
                            valueWrapper  : styles.dropdownValueWrapper,
                            selectedValue : styles.dropdownSelectedValue,
                            labelWrapper  : styles.dropdownLabelWrapper,
                            dropdownMenu  : styles.dropdownMenu,
                            itemMenu      : styles.dropdownMenuItem
                        }}
                        customMenuStyles  = {customMenuStyles}
                        onToggleMenu      = {onToggleMenu}
                        menuAnimation     = 'fade'
                        portalId          = {portalId}
                        themeMode         = {themeMode}
                        isRequired
                        forceMobilePortal
                    />
                ) : (
                    <CriticalValue
                        value     = {value || EMPTY_TEXT}
                        maxWidth  = {maxWidth}
                        className = {valueClassName}
                    />
                )
            }
        </div>
    );
}

List.propTypes = {
    value          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    options        : PropTypes.array,
    name           : PropTypes.string,
    menuYOffset    : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange       : PropTypes.func,
    onToggleMenu   : PropTypes.func,
    isDisabled     : PropTypes.bool,
    isProcessing   : PropTypes.bool,
    isSettable     : PropTypes.bool.isRequired,
    valueClassName : PropTypes.string,
    portalId       : PropTypes.string,
    maxWidth       : PropTypes.string,
    themeMode      : PropTypes.string
};

List.defaultProps = {
    value          : EMPTY_TEXT,
    options        : [],
    name           : '',
    onChange       : void 0,
    onToggleMenu   : void 0,
    menuYOffset    : void 0,
    isDisabled     : false,
    isProcessing   : false,
    valueClassName : '',
    portalId       : '',
    maxWidth       : '100%',
    themeMode      : ''
};

export default List;

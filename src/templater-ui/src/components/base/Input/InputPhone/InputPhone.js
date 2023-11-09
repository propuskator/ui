/* eslint-disable security/detect-non-literal-regexp, no-shadow */
import React, {
    useCallback,
    useState,
    useEffect,
    useRef
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import {
    getScreenParams
}                       from './../../../../utils/screen';
import * as KEY_CODES   from './../../../../constants/keyCodes';
import Input            from './../Input';
import IconButton       from './../../IconButton';
import SvgIcon          from './../../SvgIcon';
import DropdownMenu     from './../../Dropdown/DropdownMenu';

import {
    COUNTRIES_LIST
}                       from './countries';
import flagsStyles      from './flags/flags.less';
import styles           from './InputPhone.less';

const cx = classnames.bind(styles);

const COUNTRIES_MENU_OPTIONS = COUNTRIES_LIST.map(country => ({
    value : country.iso2,
    label : country.name,
    item  : {
        label       : country.name,
        countryCode : country.iso2,
        dialCode    : country.dialCode
    }
}));

function InputPhone(props) {   /* eslint-disable-line max-lines-per-function */
    const {
        value,
        withError,
        errorMessage,
        name,
        onChange,
        isProcessing,
        label,
        ...rest
    } = props;
    const [ sortedCountries, setSortedCountries ] = useState(COUNTRIES_MENU_OPTIONS);
    const [ selectedCountryCode, setSelectedCountryCode ] = useState();
    const [ isMenuOpen, setIsMenuOpen ]           = useState(false);
    const [ menuStyles, setMenuStyles ]           = useState({});

    const selectedCountryByCode = selectedCountryCode
        ? COUNTRIES_LIST?.find(country => country.iso2 === selectedCountryCode)
        : null;

    const isValueExist = !!value?.length;

    const inputRef     = useRef({});
    const componentRef = useRef({});

    useEffect(() => {
        function handleKeyPressed(e) {
            if (e.keyCode === KEY_CODES.TAB) {
                closeMenu();
            }
        }

        document.addEventListener('mousedown', handleKeyPressed);
        document.addEventListener('keydown', handleKeyPressed);

        return () => {
            document.removeEventListener('mousedown', handleKeyPressed);
            document.removeEventListener('keydown', handleKeyPressed);
        };
    }, []);

    useEffect(() => () => clearTimeout(componentRef.current.updateCaretTimeout), []);

    useEffect(() => {
        const digitsValue = value.replace(/\D/g, '');

        if (selectedCountryCode) {
            if (!digitsValue?.length) {
                return setSelectedCountryCode('');
            }
        } else {
            if (!digitsValue?.length) return;

            const countriesByValue = COUNTRIES_LIST.filter(country => {
                const dialCode = country?.dialCode ? country?.dialCode.replace(/\D/g, '') : null;

                if (!dialCode) return false;
                const dialCodeRegexp = new RegExp(`^${dialCode}`);

                return dialCodeRegexp.test(digitsValue);
            });

            const countriesWithFullFormat = countriesByValue.filter(country => {
                const maskedValue = getMaskedValue(digitsValue, country);

                return maskedValue?.length === country?.format?.length;
            });
            const selectedCountry = countriesWithFullFormat?.length
                ? countriesWithFullFormat[0]
                : countriesByValue[0];

            setSelectedCountryCode(selectedCountry?.iso2 || null);
        }
    }, [ value, selectedCountryCode ]);

    useEffect(() => {
        setSortedCountries(() => [ ...COUNTRIES_MENU_OPTIONS ].sort((first) => {
            return first?.value === selectedCountryCode ? -1 : 1;   // eslint-disable-line no-magic-numbers
        }));
    }, [ selectedCountryCode ]);

    function handleOpenMenu() {
        setIsMenuOpen(true);
    }

    function handleCloseMenu() {
        setIsMenuOpen(false);
    }

    function checkIsCountryCodeValid(digitsValue, dialCode) {
        if (!digitsValue?.length) return true;

        const digitsDialCode = dialCode ? dialCode.replace(/\D/g, '') : null;

        if (!digitsDialCode) return true;
        const dialCodeRegexp = new RegExp(`^${dialCode}`);

        return dialCodeRegexp.test(digitsValue);
    }

    function handleChangeInput({ value }, e) {
        if (value === '+') {
            changeInputValue(value);
            fixCaretPosition({ target: e?.target, value });

            return;
        }
        const digitsValue = value.replace(/\D/g, '');

        const processValue = digitsValue ? `+${digitsValue}` : '';

        if (selectedCountryCode) {
            const isCodeValid = checkIsCountryCodeValid(digitsValue, selectedCountryByCode?.dialCode);

            if (!isCodeValid) setSelectedCountryCode(null);
        }

        const masked = getMaskedValue(processValue);
        const nextDigits = processValue.replace(/\D/g, '');
        const maskedDigits = masked.replace(/\D/g, '');

        const isOverflow = maskedDigits?.length !== nextDigits?.length;

        changeInputValue(isOverflow ? maskedDigits : nextDigits);

        fixCaretPosition({ target: e?.target, value: processValue });
    }

    function changeInputValue(valueToSet) {
        componentRef.current.prevValue = props.value;

        onChange({ name, value: valueToSet });
    }

    function fixCaretPosition({ target, value }) {
        if (!target) return;

        const thisRef            = componentRef.current;
        const { prevValue = '' } = thisRef;
        const caretPosition      = target.selectionStart;
        const maskedValue        = getMaskedValue(value);
        const maskedPrevValue    = getMaskedValue(prevValue);

        const isMoveForward       = maskedPrevValue.length < maskedValue.length;
        const isStayAtThePotision = maskedPrevValue.length === maskedValue.length;

        const symbolsAfterCaret        = maskedValue.slice(caretPosition);
        const symbolsBeforeCaret       = maskedValue.slice(0, caretPosition).split('').reverse().join('');
        const forwardDigitSymbolIndex  = symbolsAfterCaret.split('').findIndex(symbol => /\d/.test(symbol));
        const backwardDigitSymbolIndex = symbolsBeforeCaret.split('').findIndex(symbol => /\d/.test(symbol));

        if (isStayAtThePotision || isMoveForward) {
            const isCaretAtTheEnd = maskedPrevValue.length < caretPosition;

            if (isCaretAtTheEnd) return;

            const nextCaretPosition = forwardDigitSymbolIndex > 0
                ? caretPosition + forwardDigitSymbolIndex
                : caretPosition;

            thisRef.updateCaretTimeout = setTimeout(() => {
                target.selectionStart = nextCaretPosition;
                target.selectionEnd   = nextCaretPosition;
            }, 0);
        } else {    // move back
            const isCaretAtTheEnd = caretPosition === maskedPrevValue.length - 1;

            if (isCaretAtTheEnd) return;

            const nextCaretPosition = forwardDigitSymbolIndex > 0
                ? caretPosition - backwardDigitSymbolIndex
                : caretPosition;

            thisRef.updateCaretTimeout = setTimeout(() => {
                target.selectionStart = nextCaretPosition;
                target.selectionEnd   = nextCaretPosition;
            }, 0);
        }
    }

    function openMenu(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        if (isProcessing) return;
        const nodeData = inputRef.current.node.getBoundingClientRect();

        handleOpenMenu();
        const MENU_Y_OFFSET = 10;
        const menuWidth = nodeData.width;
        const menuLeft  = nodeData.left;
        const menuHeight = 175;
        const menuMinHeight = 105;

        const { height } = getScreenParams();

        const maxHeightToBottom = height - nodeData.top - nodeData.height - MENU_Y_OFFSET;
        const maxHeightToTop    = height - (maxHeightToBottom - nodeData.height) - MENU_Y_OFFSET;

        const isCorrectHeightToBottom = maxHeightToBottom > menuHeight;
        const isCorrectMinHeightToBottom = !isCorrectHeightToBottom
            ? maxHeightToBottom > menuMinHeight
            : true;

        const isCorrectHeightToTop = maxHeightToTop > menuHeight;
        const isCorrectMinHeightToTop = !isCorrectHeightToTop
            ? maxHeightToTop > menuMinHeight
            : true;

        const isOpenToBottom = isCorrectHeightToBottom || isCorrectMinHeightToBottom
            || maxHeightToBottom > maxHeightToTop;

        let correctHeight = 0;

        if (isOpenToBottom) {
            if (isCorrectHeightToBottom) correctHeight = menuHeight;
            else if (isCorrectMinHeightToBottom) correctHeight = menuMinHeight;
            else correctHeight = maxHeightToBottom;
        } else {
            if (isCorrectHeightToTop) correctHeight = menuHeight;   // eslint-disable-line no-lonely-if
            else if (isCorrectMinHeightToTop) correctHeight = menuMinHeight;
            else correctHeight = maxHeightToTop;
        }

        const correctTop = isOpenToBottom
            ? nodeData.top + nodeData.height
            : nodeData.top - correctHeight - MENU_Y_OFFSET;

        setMenuStyles({
            top    : `${Math.round(correctTop)}px`,
            left   : `${Math.round(menuLeft)}px`,
            width  : `${Math.round(menuWidth)}px`,
            height : `${Math.round(correctHeight)}px`
        });
    }

    function closeMenu() {
        handleCloseMenu();
    }

    function handleSelectMenuItem(countryCode) {
        setSelectedCountryCode(countryCode);
        closeMenu();

        const countryByCode = COUNTRIES_LIST?.find(country => country.iso2 === countryCode);
        const digitsValue = value.replace(/\D/g, '');
        const newDialCode = countryByCode?.dialCode;

        const isValidCodeInValue = checkIsCountryCodeValid(digitsValue, newDialCode);

        if (!isValidCodeInValue || !digitsValue?.length) {
            const digitsDialCode = newDialCode?.replace(/\D/g, '');
            const nextValue = countryByCode?.dialCode + (digitsValue?.slice(digitsDialCode?.length) || '');

            const masked = getMaskedValue(nextValue, countryByCode);
            const nextDigits = nextValue.replace(/\D/g, '');
            const maskedDigits = masked.replace(/\D/g, '');

            const isOverflow = maskedDigits?.length !== nextDigits?.length;

            changeInputValue(isOverflow ? maskedDigits : nextDigits);
        }

        inputRef.current.focus();
    }

    function getMaskedValue(rawValue, countryData = selectedCountryByCode) {
        if (!countryData) return rawValue;

        const { format = '... ... ... ... ... ...' } = countryData;
        const value = rawValue ? rawValue.replace(/\D/g, '') : '';

        if (componentRef.current.prevMaskedValue === value) {
            return componentRef.current.prevMaskedResult;
        }

        if (!format) return value;

        const formattedArray = [];
        let valueStringIndex = 0;
        const valueLength = value.length;
        const formatArray = format.split('');

        formatArray.forEach((symbol /* , symbolIndex */) => {
            if (valueStringIndex > valueLength - 1 /*  && formatArray[symbolIndex + 1] === '.' */) return;

            if (symbol === '.') {
                formattedArray.push(value[valueStringIndex]);

                valueStringIndex += 1;
            } else {
                formattedArray.push(symbol);
            }
        });
        const result = formattedArray.join('');

        componentRef.current.prevMaskedValue  = value;  // eslint-disable-line more/no-duplicated-chains
        componentRef.current.prevMaskedResult = result;  // eslint-disable-line more/no-duplicated-chains

        return result;
    }

    function renderCalendarSelect() {
        return (
            <button
                className = {cx(styles.calendarSelect, 'abort-submit')}
                onFocus   = {openMenu}
                onClick   = {openMenu}
                type      = 'button'
            >
                <div
                    className={cx(flagsStyles.flag, flagsStyles[selectedCountryCode], styles.flag, {
                        notSelected : !selectedCountryCode
                    })}
                />
                <SvgIcon
                    className = {styles.arrowIcon}
                    type  = 'arrowDownFilled'
                />
            </button>
        );
    }

    function renderMenuOption(option = {}) {
        const { countryCode, label, dialCode } = option;

        return (
            <div className={styles.menuOption}>
                <div className={cx(flagsStyles.flag, flagsStyles[countryCode], styles.flag)} />
                <div className={styles.label}>
                    {label}  <b className={styles.dialCode}>+ {dialCode}</b>
                </div>
            </div>
        );
    }

    function handleClearField() {
        changeInputValue('');
        inputRef.current.focus();
    }

    function renderClearButton() {
        if (!isValueExist) return;

        return (
            <IconButton
                key        = 'clearButton'
                className  = {styles.clearIconButton}
                onClick    = {handleClearField}
                iconType   = 'cross'
            />
        );
    }

    const inputPhoneCN = cx(styles.InputPhone, {
        withValue : isValueExist,
        openMenu  : isMenuOpen
    });

    return (
        <div className={inputPhoneCN}>
            <Input
                {...rest}
                value                = {getMaskedValue(value)}
                ref                  = {inputRef}
                label                = {label || 'Phone'}
                forceFocused         = {isMenuOpen}
                onChange             = {handleChangeInput}
                renderStartAdornment = {renderCalendarSelect}
                renderEndAdornment   = {renderClearButton}
                errorMessage         = {errorMessage}
                withError            = {withError}
                isProcessing         = {isProcessing}
                withValue
            />

            <DropdownMenu
                items        = {sortedCountries}
                renderOption = {renderMenuOption}
                menuStyles   = {menuStyles}
                isOpened     = {isMenuOpen}
                onChange     = {handleSelectMenuItem}
                value        = {selectedCountryCode}
                closeMenu    = {useCallback(handleCloseMenu, [])}
            />
        </div>
    );
}

InputPhone.propTypes = {
    value        : PropTypes.string.isRequired,
    name         : PropTypes.string,
    onChange     : PropTypes.func.isRequired,
    withError    : PropTypes.bool,
    isProcessing : PropTypes.bool,
    errorMessage : PropTypes.string,
    label        : PropTypes.string
};

InputPhone.defaultProps = {
    name         : '',
    withError    : true,
    isProcessing : false,
    errorMessage : '',
    label        : void 0
};

export default React.memo(InputPhone);

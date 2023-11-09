/* eslint-disable babel/no-unused-expressions */
import React, {
    useImperativeHandle,
    forwardRef,
    useState,
    useRef,
    useEffect,
    memo
}                                  from 'react';
import classnames                  from 'classnames/bind';
import PropTypes                   from 'prop-types';
import { v4 as uuidv4 }            from 'uuid';
import OutlinedInput               from '@material-ui/core/OutlinedInput';
import InputLabel                  from '@material-ui/core/InputLabel';
import FormControl                 from '@material-ui/core/FormControl';
import InputAdornment              from '@material-ui/core/InputAdornment';

import { fixScrollIssueMobSafari }      from '../../../utils/scroll';
import { filterZeroWidthCharacters }    from '../../../utils';

import Link                        from '../Link';
import IconButton                  from '../IconButton';
import ErrorMessage                from '../ErrorMessage';

import { useStyles }               from './MaterialInput';
import styles                      from './Input.less';

const cx = classnames.bind(styles);
const INPUT_CLASSES = {
    root : styles.root
};

function Input(props, ref) {    /* eslint-disable-line max-lines-per-function */
    const {
        className,
        themeMode,
        classes,
        name,
        value,
        label,
        errorMessage,
        autoFocus,
        renderStartAdornment,
        renderEndAdornment,
        onChange,
        onClickShortcut,
        onFocus,
        onBlur,
        onClick,
        inputProps,
        withError = true,
        lockIosScroll = true,
        forceFocused,
        inputType,
        disabled,
        inputId,
        withValue,
        onEditStart,
        fixSelectionStart,
        multiline,
        isProcessing,
        isLoading,
        isInvalid,
        autoCapitalize,
        withClearButton,
        readOnly,
        shortcuts,
        withDisableBg,
        rowsMax,
        rows,
        inputComponent
    } = props;
    const inputRef = useRef({ });
    const [ hackKey, setHackKey ] = useState({
        key    : uuidv4(),
        action : ''
    });

    useImperativeHandle(ref, () => ({
        node  : inputRef.current,
        focus : () => {
            setHackKey({
                key    : uuidv4(),
                action : 'set-focus'
            });

            // Doesn`t work: inputRef.current.focus();
        },
        blur : (e) => {
            inputRef.current.blur(e);
        }
    }), [ hackKey ]);

    useEffect(() => () => {
        lockIosScroll && fixScrollIssueMobSafari({ isDisableScroll: false });
    }, []);

    const withClear = withClearButton && (!!value || withValue);

    function handleChange(e) {
        if (isProcessing) return;
        const { target = {} } = e;
        const { value } = target; /* eslint-disable-line no-shadow */

        const filteredValue = filterZeroWidthCharacters(value, multiline);

        if (onChange) onChange({ name, value: filteredValue }, e);
    }
    function handleClearField(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        if (onChange) onChange({ name, value: '' });

        if (!readOnly) {
            setHackKey({
                key    : uuidv4(),
                action : 'set-focus'
            });
        }
    }

    function handleInputClick(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        if (fixSelectionStart) updateSelectionStart(e);
        if (onClick) onClick(e);
    }

    function handleInputFocus(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        if (onFocus) onFocus(e);
        if (onEditStart) onEditStart(e);

        lockIosScroll && fixScrollIssueMobSafari({ isDisableScroll: true, elemNode: inputRef.current });
    }

    function handleInputBlur(e) {
        if (onBlur) onBlur(e);
        lockIosScroll && fixScrollIssueMobSafari({ isDisableScroll: false });
    }

    function updateSelectionStart(e) {
        if (e.target.tagName === 'INPUT') return;
        const input = e.target.firstChild;

        if (input?.createTextRange) {
            const part = input?.createTextRange();

            part?.move('character', 0);
            part?.select();
        } else if (input?.setSelectionRange) {
            const inputValue = input.value.length;

            input?.setSelectionRange(inputValue, inputValue);
        }
    }

    function renderInputEndAdornment() {
        if (!withClear) return null;

        return (
            <InputAdornment
                key     = 'inputAdornment'
                classes = {{ root: styles.inputAdornment }}
            >
                <IconButton
                    key       = 'clearButton'
                    className = {cx(styles.clearIconButton, 'abort-submit')}
                    onClick   = {handleClearField}
                    iconType  = 'cross'
                />
            </InputAdornment>
        );
    }

    const customClasses = useStyles();

    const inputWrapperCN = cx(styles.inputWrapper, classes?.inputWrapper, {
        [customClasses.inputWrapper] : true,
        [customClasses.root]         : true,
        [styles.error]               : !!errorMessage || !!isInvalid,
        [className]                  : className,
        [styles.forceFocused]        : forceFocused,
        [`${themeMode}Theme`]        : themeMode,
        invalid                      : isInvalid,
        processing                   : isProcessing,
        loading                      : isLoading,
        withClearButton              : withClear,
        withoutValue                 : !withValue || !value?.trim()?.length,
        withDisableBg,
        multiline,
        withValue,
        disabled
    });

    const inputCN = cx({
        [customClasses.input] : true,
        [styles.input]        : true
    });

    const inputLabelCN = cx(styles.inputLabel, {
        [customClasses.inputLabel] : true
    });

    return (
        <>
            <FormControl
                variant   = 'outlined'
                className = {inputWrapperCN}
                error     = {!!errorMessage || isInvalid}
            >
                { label
                    ? (
                        <InputLabel
                            htmlFor   = 'component-outlined'
                            className = {inputLabelCN}
                            classes={{
                                shrink : styles.inputLabelShrink
                            }}
                        >
                            { label }
                        </InputLabel>
                    ) : null
                }
                <OutlinedInput
                    id               = {inputId || name || hackKey.key}
                    classes          = {{
                        ...INPUT_CLASSES,
                        input : classes?.input
                    }}
                    key              = {hackKey.key}
                    value            = {value}
                    type             = {inputType}
                    onChange         = {handleChange}
                    inputComponent   = {inputComponent}
                    ref              = {node => inputRef.current = node}
                    className        = {inputCN}
                    autoComplete     = 'off'
                    autoFocus        = {hackKey.action === 'set-focus' || autoFocus}
                    inputProps       = {{
                        autoCapitalize : autoCapitalize ? 'on' : 'off',
                        ...(inputProps || {})
                    }}
                    onFocus          = {handleInputFocus}
                    onBlur           = {handleInputBlur}
                    endAdornment     = {renderEndAdornment
                        ? renderEndAdornment()
                        : renderInputEndAdornment()
                    }
                    startAdornment   = {renderStartAdornment ? renderStartAdornment() : null}
                    fullWidth
                    disabled         = {disabled}
                    onClick          = {handleInputClick}
                    multiline        = {multiline}
                    readOnly         = {readOnly}
                    rowsMax          = {rowsMax}
                    rows             = {rows}
                />
            </FormControl>
            { shortcuts?.length
                ? (
                    <div className={styles.shortcuts}>
                        { shortcuts?.map(shortcut => (
                            <Link
                                key       = {shortcut?.value}
                                className = {cx(styles.shortcut)}
                                onClick   = {() => {   // eslint-disable-line react/jsx-no-bind
                                    if (onClickShortcut) onClickShortcut({ value: shortcut?.value });
                                    else onChange({ name, value: shortcut?.value });
                                }}
                                color     = 'primary'
                            >
                                {shortcut?.label}
                            </Link>
                        )) }
                    </div>
                ) : null
            }

            { withError ? <ErrorMessage error={errorMessage} /> : null }
        </>
    );
}

Input.propTypes = {
    name         : PropTypes.string.isRequired,
    onChange     : PropTypes.func,
    value        : PropTypes.string.isRequired,
    label        : PropTypes.string.isRequired,
    inputId      : PropTypes.string,
    errorMessage : PropTypes.string,
    className    : PropTypes.string,
    themeMode    : PropTypes.string,
    classes      : PropTypes.shape({
        inputWrapper : PropTypes.string,
        input        : PropTypes.string
    }),
    inputClassName       : PropTypes.string,
    renderStartAdornment : PropTypes.func,
    renderEndAdornment   : PropTypes.func,
    onBlur               : PropTypes.func,
    onFocus              : PropTypes.func,
    onClick              : PropTypes.func,
    onEditStart          : PropTypes.func,
    forceFocused         : PropTypes.bool,
    autoFocus            : PropTypes.bool,
    withError            : PropTypes.bool,
    disabled             : PropTypes.bool,
    inputProps           : PropTypes.shape({}),
    inputType            : PropTypes.bool,
    withValue            : PropTypes.bool,
    fixSelectionStart    : PropTypes.bool,
    isProcessing         : PropTypes.bool,
    isInvalid            : PropTypes.bool,
    isLoading            : PropTypes.bool,
    multiline            : PropTypes.bool,
    autoCapitalize       : PropTypes.bool,
    withClearButton      : PropTypes.bool,
    readOnly             : PropTypes.bool,
    shortcuts            : PropTypes.arrayOf(PropTypes.shape({
        label : PropTypes.any,
        value : PropTypes.any
    })),
    onClickShortcut : PropTypes.func,
    withDisableBg   : PropTypes.bool,
    lockIosScroll   : PropTypes.bool,
    rowsMax         : PropTypes.number,
    rows            : PropTypes.number,
    inputComponent  : PropTypes.oneOf([ 'button', 'input' ])
};

Input.defaultProps = {
    autoFocus            : false,
    onChange             : void 0,
    errorMessage         : '',
    className            : '',
    themeMode            : '',
    classes              : {},
    inputId              : '',
    renderStartAdornment : void 0,
    renderEndAdornment   : void 0,
    onBlur               : void 0,
    onFocus              : void 0,
    onClick              : void 0,
    onEditStart          : void 0,
    withError            : true,
    forceFocused         : false,
    disabled             : false,
    withClearButton      : false,
    inputProps           : {},
    inputType            : 'text',
    withValue            : false,
    fixSelectionStart    : true,
    isInvalid            : false,
    isProcessing         : false,
    isLoading            : false,
    multiline            : false,
    readOnly             : false,
    autoCapitalize       : true,
    shortcuts            : void 0,
    onClickShortcut      : void 0,
    withDisableBg        : false,
    lockIosScroll        : true,
    rowsMax              : void 0,
    rows                 : void 0,
    inputComponent       : void 0
};

export default memo(forwardRef(Input));

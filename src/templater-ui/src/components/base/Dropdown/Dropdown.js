/* eslint-disable babel/no-unused-expressions */
import React                                 from 'react';
import PropTypes                             from 'prop-types';
import classnames                            from 'classnames/bind';
import { v4 as uuidv4 }                      from 'uuid';
import InputAdornment                        from '@material-ui/core/InputAdornment';

import * as KEY_CODES                        from './../../../constants/keyCodes';
import globalEscHandler                      from './../../../utils/eventHandlers/globalEscHandler';
import { getScreenParams }                   from './../../../utils/screen';
import { checkIsMobile, checkIsTouchDevice } from './../../../utils/helpers/detect';
import {
    checkIsScrollIssue
}                                            from './../../../utils/scroll';
import ErrorMessage                          from './../ErrorMessage';
import Input                                 from './../Input';
import IconButton                            from './../IconButton';
import CircularProgress                      from './../CircularProgress';
import DropdownMenu                          from './DropdownMenu';
import SelectedValue                         from './SelectedValue';

import styles                                from './Dropdown.less';


const IS_TOUCH_SCREEN = checkIsTouchDevice();
const IS_SCROLL_ISSUE = checkIsScrollIssue();

const cx = classnames.bind(styles);

class Dropdown extends React.Component {
    static propTypes = {
        name  : PropTypes.string,
        value : PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.bool,
            PropTypes.array
        ]),
        isLoading            : PropTypes.bool,
        onChange             : PropTypes.func.isRequired,
        defaultValue         : PropTypes.string,
        label                : PropTypes.string,
        className            : PropTypes.string,
        errorMessage         : PropTypes.string,
        disabled             : PropTypes.bool,
        options              : PropTypes.arrayOf(PropTypes.object),
        multiple             : PropTypes.bool,
        withSearch           : PropTypes.bool,
        withChip             : PropTypes.bool,
        isProcessing         : PropTypes.bool,
        withError            : PropTypes.bool,
        renderOption         : PropTypes.func,
        renderValue          : PropTypes.func,
        renderStartAdornment : PropTypes.func,
        renderEndAdornment   : PropTypes.func,
        withKeyboard         : PropTypes.bool,
        withPortal           : PropTypes.bool,
        withClear            : PropTypes.bool,
        forceMobilePortal    : PropTypes.bool,
        // forwardRef   : PropTypes.shape({ current: PropTypes.shape({}) }),
        portalId             : PropTypes.string,
        inputProps           : PropTypes.object,
        meta                 : PropTypes.shape({
            total  : PropTypes.number,
            offset : PropTypes.number
        }),
        onLoadMore       : PropTypes.func,
        onToggleMenu     : PropTypes.func,
        onChangeSearch   : PropTypes.func,
        isRequired       : PropTypes.bool,
        filterBySearch   : PropTypes.bool,
        customMenuStyles : PropTypes.shape({
            top            : PropTypes.string,
            left           : PropTypes.string,
            width          : PropTypes.string,
            height         : PropTypes.string,
            justifyContent : PropTypes.string
        }),
        menuAnimation : PropTypes.oneOf([ 'fade', 'bounceIn' ]),
        classes       : PropTypes.shape({
            input         : PropTypes.string,
            inputWrapper  : PropTypes.string,
            itemsWrapper  : PropTypes.string,
            itemMenu      : PropTypes.string,
            valueWrapper  : PropTypes.string,
            selectedValue : PropTypes.string,
            labelWrapper  : PropTypes.string,
            dropdownMenu  : PropTypes.string,
            value         : PropTypes.string
        }),
        themeMode               : PropTypes.string,
        t                       : PropTypes.func,
        isSortOnlyOnOpen        : PropTypes.bool,
        withClearSearchOnSelect : PropTypes.bool
    };

    static defaultProps = {
        name                 : '',
        value                : void 0,
        defaultValue         : '',
        options              : [],
        className            : '',
        label                : '',
        errorMessage         : '',
        isLoading            : false,
        disabled             : false,
        multiple             : false,
        // forwardRef   : void 0,
        withSearch           : false,
        withChip             : true,
        isProcessing         : false,
        withError            : true,
        renderStartAdornment : void 0,
        renderEndAdornment   : void 0,
        renderOption         : void 0,
        renderValue          : void 0,
        withKeyboard         : true,
        withPortal           : true,
        forceMobilePortal    : false,
        portalId             : void 0,
        withClear            : true,
        inputProps           : {},
        meta                 : {
            total  : 0,
            offset : 0
        },
        onLoadMore              : void 0,
        onChangeSearch          : void 0,
        onToggleMenu            : void 0,
        isRequired              : false,
        filterBySearch          : false,
        customMenuStyles        : void 0,
        menuAnimation           : 'bounceIn',
        classes                 : {},
        themeMode               : '',
        t                       : (text) => text,
        isSortOnlyOnOpen        : false,
        withClearSearchOnSelect : true
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpened         : false,
            isAdornmentFocus : false,
            searchValue      : '',
            menuStyles       : {},
            hackKey          : 'initial'  // need to refresh component because of bugs
        };

        this.wrapperRef      = React.createRef({});
        this.inputRef        = React.createRef({});
        this.menuItemsRef    = React.createRef({});
        this.clearButtonRef  = React.createRef({});

        this.isMenuUsePortal =  checkIsMobile() ? props.forceMobilePortal  : props.withPortal;
    }

    componentDidMount() {
        // document.addEventListener('touchstart', this.handleClickOutsideDropdown);
        document.addEventListener('mousedown', this.handleClickOutsideDropdown);
        document.addEventListener('keydown', this.handleKeyPressed);
    }

    componentWillUnmount() {
        // document.removeEventListener('touchstart', this.handleClickOutsideDropdown);
        document.removeEventListener('mousedown', this.handleClickOutsideDropdown);
        document.removeEventListener('keydown', this.handleKeyPressed);
        globalEscHandler.unregister(this.handleCloseByEsc);
    }

    getSelected = () => {
        const {
            options, value = this.getDefaultValue(), multiple
        } = this.props;

        const result = multiple
            ? options?.filter(option => value.includes(option.value))
            : options?.find(option => option.value === value);

        return result;
    }

    getDefaultValue = () => {
        const { multiple } = this.props;

        return multiple ? [] : '';
    }

    getSortedItemsByValue = () => {
        const {
            isSortOnlyOnOpen, multiple, value = this.getDefaultValue(),
            options
        } = this.props;
        const { selectedValueOnOpen } = this.state;

        const selectedValue = isSortOnlyOnOpen ? selectedValueOnOpen || value : value;
        const arrayValue = multiple &&  selectedValue?.length ? selectedValue : [ selectedValue ];

        const selectedOptions    = (arrayValue || [])
            ?.map(val => options.find(item => item.value === val))
            ?.filter(item => !!item);

        const notSelectedOptions = options.filter(item => !(arrayValue || [])?.includes(item.value));

        this.sortedItems = [
            ...selectedOptions,
            ...notSelectedOptions
        ];

        return this.sortedItems;
    }

    resetClearButtonFocus = () => {
        this.clearButtonRef?.current?.blur();
    }

    handleCloseByEsc = () => {
        this.handleCloseDropdown();

        // this.inputRef?.current?.blur(); //  - DOESNT WORK CORRECTLY
        this.refreshComponent();
    }

    handleSelectItem = (id) => {
        const { onChange, name, multiple, value = this.getDefaultValue(), withClearSearchOnSelect } = this.props;

        if (multiple) {
            let valueToSet = [ ];

            if (value.includes(id)) {
                valueToSet = value.filter(selectedId => selectedId !== id);
            } else {
                valueToSet = [ ...value, id ];

                if (withClearSearchOnSelect) this.clearSearch();
            }

            onChange({ name, value: valueToSet });

            if (IS_SCROLL_ISSUE) {
                this.handleCloseDropdown();
                this.inputRef?.current?.blur();
            } else this?.inputRef?.current?.focus();
        } else {
            onChange({ name, value: id });

            this.handleCloseDropdown();
            this.clearSearch();
            this.inputRef?.current?.blur();
        }
    }

    handleClickOutsideDropdown = (e) => {
        const refNode = this.wrapperRef.current;

        const isOutside = !refNode?.contains(e.target)
            && !this.menuItemsRef?.current?.contains(e.target);

        if (refNode && isOutside && this.state.isOpened) {
            this.handleCloseDropdown();
        }
    }

    handleKeyPressed = (e) => {
        const { isLoading, isProcessing, disabled } = this.props;
        const { isOpened } = this.state;

        if (!isOpened || isLoading || disabled || isProcessing) return;

        if (e.keyCode === KEY_CODES.TAB) {
            return this.handleTabClick(e);
        }
    }

    handleTabClick = (e) => {
        const { isOpened, isProcessing, value } = this.state;

        if (!e.shiftKey) {  // move forward
            if (value && isOpened && !isProcessing) {   // bad fix of clearButtonRef focus
                e.preventDefault();
                e.stopPropagation();

                this.clearButtonRef.current?.focus();
            } else {
                this.handleCloseDropdown();
                this.inputRef?.current?.blur();
            }
        } else {
            // close if we move backward
            this.handleCloseDropdown();
            this.inputRef?.current?.blur();
        }
    }

    handleOpenDropdown = () => {
        const { disabled, options, customMenuStyles, isProcessing, onToggleMenu, value } = this.props;

        if (isProcessing || disabled) return;

        let menuStyles;

        if (customMenuStyles) {
            menuStyles = customMenuStyles;
        } else  {
            const nodeData = this.inputWrapper.getBoundingClientRect();
            const { height } = getScreenParams();
            const OPTION_HEIGHT = 35;
            const MAX_OPTIONS = 5;
            const MENU_Y_OFFSET = 10;
            const menuTop = nodeData.top + nodeData.height;
            const menuHeight = options.length < MAX_OPTIONS
                ? options.length * OPTION_HEIGHT
                : MAX_OPTIONS * OPTION_HEIGHT;
            const isOpenToBottom = height > menuTop + menuHeight + MENU_Y_OFFSET;

            const correctMenuTop = isOpenToBottom
                ? menuTop
                : nodeData.top - menuHeight - MENU_Y_OFFSET;

            if (this.isMenuUsePortal) {
                menuStyles = {
                    top            : `${correctMenuTop}px`,
                    left           : `${nodeData.left}px`,
                    width          : `${nodeData.width}px`,
                    height         : isOpenToBottom ?  void 0 : `${menuHeight}px`,
                    justifyContent : isOpenToBottom ? 'flex-start' : 'flex-end'
                };
            } else {
                menuStyles = {
                    top            : '0',
                    left           : '1px', // фикс бага на андроиде
                    width          : 'calc(100% - 1px)', // фикс бага на андроиде
                    height         : isOpenToBottom ?  void 0 : `${menuHeight}px`,
                    justifyContent : isOpenToBottom ? 'flex-start' : 'flex-end',
                    position       : 'absolute'
                };
            }
        }

        this.setState({
            isOpened            : true,
            searchValue         : '',
            menuStyles,
            selectedValueOnOpen : value
        });

        if (onToggleMenu) onToggleMenu({ isOpened: true });
        globalEscHandler.register(this.handleCloseByEsc);
    }

    handleCloseDropdown = () => {
        const { onChangeSearch, onToggleMenu } = this.props;

        if (!this.state.isOpened) return;

        this.setState({
            isOpened            : false,
            searchValue         : '',
            selectedValueOnOpen : void 0
        });

        if (onChangeSearch) onChangeSearch('');
        if (onToggleMenu) onToggleMenu({ isOpened: false });
        globalEscHandler.unregister(this.handleCloseByEsc);
    }

    handleClearField = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { onChange, name } = this.props;

        onChange({ name, value: this.getDefaultValue() });

        this.handleCloseDropdown();
        this.inputRef?.current?.blur();
    }

    handleSearchValueChange = ({ value }) => {
        const { withSearch, onChangeSearch } = this.props;

        if (!withSearch) return null;

        this.setState({
            searchValue : value
        });

        if (onChangeSearch) onChangeSearch(value);
    }

    handleInputFocus = () => {
        const { withSearch } = this.props;

        if (this.state.isOpened) return;

        this.handleOpenDropdown();
        if (withSearch && this?.inputRef?.current) {
            this?.inputRef?.current?.focus();
        }
    }

    handleInputClick = () => {
        if (this.state.isOpened) return;

        this.handleOpenDropdown();
    }

    handleToggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { isOpened } = this.state;
        const { withSearch } = this.props;

        if (isOpened) {
            this.handleCloseDropdown();
            this.inputRef?.current?.blur();
        } else {
            this.handleOpenDropdown();
            if (withSearch && this?.inputRef?.current) {
                this?.inputRef?.current?.focus();
            }
        }
    }

    refreshComponent = () => {  // need to force refresh component e.g. force remove of focus
        this.setState({
            hackKey : uuidv4()
        });
    }

    clearSearch = () => {
        const { withSearch, onChangeSearch } =  this.props;

        if (!withSearch) return;

        this.setState({
            searchValue : ''
        });

        if (onChangeSearch) onChangeSearch('');
    }

    filterBySearch = (list = []) => {
        const { searchValue = '' } = this.state;

        if (!searchValue || !list?.length) return list;

        return list?.filter(listItem => {
            return listItem?.label?.toLowerCase()?.includes(searchValue?.toLowerCase());
        });
    }

    renderInputValue = (selected, withLoader) => {
        const {
            multiple, renderValue, withSearch, defaultValue,
            classes, themeMode, withChip, t
        } = this.props;
        const { isOpened } = this.state;
        const sortedItems = multiple ? this.getSortedItemsByValue() : selected;
        const selectedValue = multiple ? sortedItems.slice(0, selected.length) : selected;

        if (withSearch && isOpened) return null;

        if (multiple && renderValue) {
            return renderValue(selectedValue);
        }

        return (
            <SelectedValue
                value             = {selectedValue}
                defaultValue      = {defaultValue}
                multiple          = {multiple}
                isMenuOpen        = {isOpened}
                withLoader        = {withLoader}
                withChip          = {withChip}
                themeMode         = {themeMode}
                t                 = {t}
                classes           = {{
                    labelWrapper  : classes.labelWrapper,
                    selectedValue : classes.selectedValue,
                    value         : classes.value
                }}
            />
        );
    }

    renderStartAdornment = () => {
        const { renderStartAdornment } = this.props;

        return renderStartAdornment
            ? (<InputAdornment
                key       = 'startInputAdornment'
                classes   = {{ root: styles.startInputAdornment }}
                position  = 'start'
            >
                {renderStartAdornment()}
            </InputAdornment>)
            : null;
    }

    renderEndAdornment = ({ isSelectedExist, withLoader, value }) => () => {
        const { isOpened } = this.state;
        const { renderEndAdornment, isProcessing, isLoading, isRequired, withClear } = this.props;

        const isClearVisible = withClear && !isProcessing && isSelectedExist && !isOpened && !isRequired;

        return (
            <InputAdornment
                key       = 'inputAdornment'
                classes   = {{ root: styles.inputAdornment }}
            >
                { renderEndAdornment
                    ? renderEndAdornment()
                    : <>
                        { withLoader
                            ? (
                                <div
                                    className={classnames(styles.loaderWrapper, {
                                        [styles.checked] : !!value
                                    })}
                                >
                                    <CircularProgress
                                        key       = 'circularProgress'
                                        color     = 'greyDark'
                                        classes   = {{
                                            svg : styles.progressSvg
                                        }}
                                        size      = 'S'
                                    />
                                </div>
                            ) : null
                        }
                        { isClearVisible
                            ? (
                                <IconButton
                                    key        = 'clearButton'
                                    className  = {styles.clearIconButton}
                                    onClick    = {this.handleClearField}
                                    forwardRef = {this.clearButtonRef}
                                    iconType   = 'cross'
                                />
                            ) : null
                        }
                        { (!isLoading && !isProcessing)
                        && (!isSelectedExist || isRequired || !withClear)
                            ? (
                                <IconButton
                                    onClick   = {this.handleToggleMenu}
                                    className = {styles.arrowIcon}
                                    iconType  = 'arrowDownFilled'
                                    disableFocusRipple
                                />
                            ) : null
                        }
                    </>
                }
            </InputAdornment>
        );
    }

    render() {  /* eslint-disable-line max-lines-per-function */
        const {
            className, classes, isLoading, errorMessage, value = this.getDefaultValue(),
            disabled, name, label, withSearch, withError, isProcessing,
            multiple, renderOption, portalId, withKeyboard, inputProps,
            onLoadMore, meta = {}, options, filterBySearch,
            menuAnimation, themeMode, t
        } = this.props;
        const { isOpened, searchValue, menuStyles = {}, hackKey } = this.state;

        const sortedItems     = this.getSortedItemsByValue();
        const filteredItems   = filterBySearch ? this.filterBySearch(sortedItems) : sortedItems;
        const selected        = this.getSelected();
        const isSelectedExist = multiple ? !!selected.length : !!selected;
        const isNothingFound  = searchValue.trim().length ? !options.length : false;
        const withValue = !isLoading && (isSelectedExist || isOpened);
        const withLoader = (isProcessing || isLoading) && !isOpened;

        const dropdownCN = cx({
            [styles.Dropdown]      : true,
            [styles.loading]       : isLoading,
            [styles.opened]        : isOpened,
            [styles.error]         : errorMessage,
            [styles.empty]         : !value,
            [styles.disabled]      : disabled,
            [styles.processing]    : isProcessing,
            [className]            : className,
            [styles.withoutSearch] : !withSearch,
            [styles.withSearch]    : withSearch,
            [styles.withValue]     : !isLoading && (isSelectedExist || isOpened),
            [`${themeMode}Theme`]  : themeMode
        });

        return (
            <div
                className = {dropdownCN}
                ref       = {this.wrapperRef}
                key       = {hackKey}
            >
                <div
                    ref       = {node => this.inputWrapper = node}
                    className = {styles.inputWrapper}
                >
                    <Input
                        name               = {name}
                        label              = {label}
                        withValue          = {withValue}
                        onChange           = {this.handleSearchValueChange}
                        value              = {searchValue}
                        ref                = {this.inputRef}
                        themeMode          = {themeMode}
                        className          = {styles.inputWrapper}
                        classes            = {{
                            inputWrapper : classes.inputWrapper,
                            input        : classes.input
                        }}
                        forceFocused       = {isOpened}
                        onFocus            = {this.handleInputFocus}
                        onClick            = {this.handleInputClick}
                        errorMessage       = {errorMessage}
                        readOnly           = {!isOpened}
                        withError          = {false}
                        lockIosScroll      = {false}
                        inputId            = {isOpened ? 'select--opened' : void 0}
                        inputComponent     = {IS_TOUCH_SCREEN && !withKeyboard ? 'button' : 'input'}
                        renderStartAdornment = {this.renderStartAdornment}
                        renderEndAdornment   = {this.renderEndAdornment({ isSelectedExist, withLoader, value })}
                        inputProps = {inputProps}
                    />
                    { !isLoading && (!isOpened || !multiple)
                        ? (
                            <div
                                className={classnames(styles.valueWrapper, classes.valueWrapper)}
                                onClick={this.handleToggleMenu}
                            >
                                {this.renderInputValue(selected, withLoader)}
                            </div>
                        ) : null
                    }
                </div>

                <DropdownMenu
                    items                 = {filteredItems}
                    menuStyles            = {menuStyles}
                    isOpened              = {isOpened}
                    withPortal            = {this.isMenuUsePortal}
                    isLoading             = {isLoading}
                    isProcessing          = {isProcessing}
                    disabled              = {disabled}
                    onChange              = {this.handleSelectItem}
                    multiple              = {multiple}
                    value                 = {value}
                    forwardRef            = {this.menuItemsRef}
                    resetClearButtonFocus = {this.resetClearButtonFocus}
                    isNothingFound        = {isNothingFound}
                    renderOption          = {renderOption}
                    portalId              = {portalId}
                    onLoadMore            = {onLoadMore}
                    meta                  = {meta}
                    className             = {classes.dropdownMenu}
                    menuAnimation         = {menuAnimation}
                    t                     = {t}
                    classes               = {{
                        itemMenu     : classes.itemMenu,
                        itemsWrapper : classes.itemsWrapper
                    }}
                    themeMode             = {themeMode}
                />

                { withError ? <ErrorMessage error={errorMessage} /> : null }
            </div>
        );
    }
}

export default Dropdown;

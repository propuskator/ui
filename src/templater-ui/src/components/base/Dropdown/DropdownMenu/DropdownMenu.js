import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';
import InfiniteScroll   from 'react-infinite-scroller';

import * as KEY_CODES   from './../../../../constants/keyCodes';
import { Fade, BounceIn }     from './../../../../utils/animations/index';
import {
    toggleScrollContent
}                       from './../../../../utils/scroll';
import Loader           from './../../Loader';
import SvgIcon          from './../../SvgIcon';
import Portal           from './../../Portal';
import DropdownItem     from './../DropdownItem';

import styles           from './DropdownMenu.less';

const cx = classnames.bind(styles);

class DropdownMenu extends React.PureComponent {
    static propTypes = {
        className : PropTypes.string,
        isOpened  : PropTypes.bool.isRequired,
        onChange  : PropTypes.func.isRequired,
        items     : PropTypes.arrayOf(PropTypes.shape({
            value : PropTypes.any.isRequired,
            label : PropTypes.string.isRequired
        })),
        classes : PropTypes.shape({
            itemMenu     : PropTypes.string,
            itemLabel    : PropTypes.strinig,
            itemsWrapper : PropTypes.string
        }),
        menuStyles : PropTypes.shape({
            top   : PropTypes.string,
            left  : PropTypes.string,
            width : PropTypes.string
        }),
        menuAnimation         : PropTypes.oneOf([ 'fade', 'bounceIn' ]),
        isLoading             : PropTypes.bool,
        isProcessing          : PropTypes.bool,
        disabled              : PropTypes.bool,
        isNothingFound        : PropTypes.bool,
        withPortal            : PropTypes.bool,
        multiple              : PropTypes.bool,
        resetClearButtonFocus : PropTypes.func,
        renderOption          : PropTypes.func,
        closeMenu             : PropTypes.func,
        portalId              : PropTypes.string,
        forwardRef            : PropTypes.shape({
            current : PropTypes.shape({})
        }),
        value : PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
            PropTypes.bool,
            PropTypes.array
        ]),
        onLoadMore : PropTypes.func,
        meta       : PropTypes.shape({
            total  : PropTypes.number,
            offset : PropTypes.number
        }),
        themeMode  : PropTypes.string,
        t          : PropTypes.func,
        tipMessage : PropTypes.any
    };

    static defaultProps = {
        className             : '',
        items                 : [],
        classes               : {},
        menuStyles            : {},
        menuAnimation         : 'bounceIn',
        value                 : void 0,
        forwardRef            : void 0,
        renderOption          : void 0,
        portalId              : void 0,
        isLoading             : false,
        isProcessing          : false,
        disabled              : false,
        isNothingFound        : false,
        multiple              : false,
        withPortal            : true,
        resetClearButtonFocus : void 0,
        closeMenu             : void 0,
        onLoadMore            : void 0,
        meta                  : {},
        themeMode             : '',
        t                     : (text) => text,
        tipMessage            : void 0
    };

    state = {
        focusedId : null,
        isOpened  : false
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.isOpened && nextProps.isOpened) {
            toggleScrollContent({ disableScroll: true });

            return {
                focusedId : null,
                isOpened  : nextProps.isOpened
            };
        } else if (prevState.isOpened && !nextProps.isOpened) {
            toggleScrollContent({ disableScroll: false });
        }

        return {
            isOpened : nextProps.isOpened
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPressed);
    }

    componentWillUnmount() {
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

        document.removeEventListener('keydown', this.handleKeyPressed);
    }

    handleTouchstart = (e) => { /* eslint-disable-line react/sort-comp */
        this.xDown = e.touches[0].clientX;
        this.yDown = e.touches[0].clientY;
    }

    handleKeyPressed = (e) => {
        const { isOpened, isLoading, isProcessing, disabled } = this.props;

        if (!isOpened || isLoading || disabled || isProcessing) return;

        if (e.keyCode === KEY_CODES.ENTER) {
            e.stopPropagation();
            e.preventDefault();
            this.handleEnterClick(e);
        } else if (e.keyCode === KEY_CODES.ARROW_DOWN) {
            this.handleArrowDownClick(e);
        } else if (e.keyCode === KEY_CODES.ARROW_UP) {
            this.handleArrowUpClick(e);
        }
    }

    handleEnterClick = (e) => {
        e.preventDefault();

        const { focusedId } = this.state;
        const { items } =  this.props;
        const focusedItem = items.find(item => item.value === focusedId);

        if (!focusedItem) return;

        this.handleSelectItem(focusedItem.value);
    }

    handleSelectItem = (id) => {
        const { onChange, value, multiple } = this.props;

        const wasSelected = multiple
            ? value?.includes(id)
            : value === id;

        onChange(id);

        this.setState({
            focusedId : wasSelected ? void 0 : id
        });

        this.scrollToElement(id);
    }

    handleArrowUpClick = (e) => {
        e.preventDefault();

        const { focusedId } = this.state;
        const { items, resetClearButtonFocus } = this.props;

        if (!items.length) return;

        if (resetClearButtonFocus) resetClearButtonFocus();

        const currentFocusedIndex = items.findIndex(item => item.value === focusedId);
        const nextFocused = currentFocusedIndex > 0 && items.length > currentFocusedIndex - 1
            ? items[currentFocusedIndex - 1]
            : items[items.length - 1];

        const nextFocusedId = focusedId
            ? nextFocused?.value || null
            : items[0].value;

        this.setState({
            focusedId : nextFocusedId
        }, this.scrollToElement(nextFocusedId));
    }

    handleArrowDownClick = (e) => {
        e.preventDefault();

        const { focusedId } = this.state;
        const { items, resetClearButtonFocus } = this.props;

        if (!items.length) return;

        if (resetClearButtonFocus) resetClearButtonFocus();

        const currentFocusedIndex = items.findIndex(item => item.value === focusedId);
        const nextFocused = currentFocusedIndex > -1 && items.length > currentFocusedIndex + 1  /* eslint-disable-line no-magic-numbers, max-len */
            ? items[currentFocusedIndex + 1]
            : items[0];

        const nextFocusedId = nextFocused
            ? nextFocused?.value
            : items[0].value;

        this.setState({
            focusedId : nextFocusedId
        }, this.scrollToElement(nextFocusedId));
    }

    setRef = (ref) => {
        this.itemsWrapperRef = ref;
        const { forwardRef } = this.props;

        if (forwardRef) {
            forwardRef.current = ref;
        }
    }

    scrollToElement = (id) => {
        const { items } = this.props;

        const index = items.findIndex(item => item.value === id);
        const list = [ ...this.itemsWrapperRef.children ];
        const elementToScroll = index > -1 ? list[index] : void 0;  /* eslint-disable-line no-magic-numbers */

        if (!elementToScroll) return;

        clearTimeout(this.scrollTimeout);

        this.scrollTimeout = setTimeout(() => {
            elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 0);
    }

    renderLoader() {
        return (
            <li className={styles.loaderWrapper}>
                <Loader className={styles.loader} size = 'XS' />
            </li>
        );
    }

    renderItems = () => {
        const { items, isLoading, isNothingFound, meta, onLoadMore, t } = this.props;

        if (isLoading && !items.length) {
            return this.renderLoader();
        }

        if (isNothingFound) {
            return (
                <li className={styles.nothingFoundWrapper}>
                    <div className = {styles.iconWrapper}>
                        <SvgIcon type='nothingFound' />
                    </div>
                    <div className={styles.text}>
                        {t('Nothing found')}
                    </div>
                </li>
            );
        }

        if (!items.length) {
            return (
                <li className={styles.emptyListWrapper}>
                    <div className = {styles.iconWrapper}>
                        <SvgIcon type='emptyList' />
                    </div>
                    <div className={styles.text}>
                        {t('List is empty')}
                    </div>
                </li>
            );
        }

        const itemsToRender = items.map(this.renderItem);
        const isBlurred = onLoadMore
            ? (!items?.length || (meta?.search && meta?.offset === 0)) && isLoading
            : !!items?.length && isLoading;

        if (onLoadMore) {
            return (
                <InfiniteScroll
                    pageStart   = {0}
                    loadMore    = {onLoadMore}
                    hasMore     = {!isLoading && meta?.total > meta?.offset}
                    useWindow   = {false}
                    loader      = {null}
                    initialLoad = {false}
                >
                    {itemsToRender}
                    { isLoading && !meta?.offset !== 0 && !isBlurred && onLoadMore
                        ? (
                            <li className={styles.loadMoreIndicator}>
                                <Loader className={styles.loader} size = 'XS' />
                            </li>
                        ) : null
                    }
                </InfiniteScroll>
            );
        }

        return itemsToRender;
    }

    renderItem = (item) => {
        const { focusedId } = this.state;
        const { value, multiple, renderOption, classes, themeMode, items, tipMessage } = this.props;
        const isSelected = multiple
            ? value.includes(item.value)
            : value === item.value;

        const withTip = items?.length === 1 && tipMessage;

        return (
            <DropdownItem
                {...item}
                key          = {`${item.value}${item.label}`}
                value        = {item.value}
                label        = {item.label}
                isSelected   = {isSelected}
                onChange     = {this.handleSelectItem}
                className    = {cx(styles.item, classes.itemMenu)}
                classes      = {{
                    label : classes.itemLabel
                }}
                isFocused    = {focusedId === item.value}
                renderOption = {renderOption}
                multiple     = {multiple}
                themeMode    = {themeMode}
                tipMessage   = {withTip ? tipMessage : void 0}
            />
        );
    }

    handleClickOverlay =() => {
        const { closeMenu } = this.props;

        if (closeMenu) closeMenu();
    }

    render() {
        const {
            className,
            classes,
            menuStyles,
            isOpened,
            isLoading,
            isNothingFound,
            items,
            portalId,
            onLoadMore,
            meta,
            menuAnimation,
            withPortal,
            themeMode,
            tipMessage
        } = this.props;
        const isBlurred = onLoadMore
            ? (!items?.length || (meta?.search && meta?.offset === 0)) && isLoading
            : !!items?.length && isLoading;

        const dropdownMenuCN = cx(styles.DropdownMenu, {
            visible               : isOpened,
            loading               : isLoading,
            nothingFound          : isNothingFound,
            emptyList             : !isLoading && !items?.length,
            absolute              : !withPortal,
            blurred               : isBlurred,
            [className]           : className,
            [`${themeMode}Theme`] : themeMode
        });

        const Animation = menuAnimation === 'fade' ? Fade : BounceIn;
        const WrapperComponent = withPortal ? Portal : React.Fragment;

        return (
            <WrapperComponent {...(withPortal ? { id: portalId } : {})}>
                <div className={dropdownMenuCN} onClick={this.handleClickOverlay}>
                    <Animation visible={isOpened}>
                        <div className={cx(styles.itemsWrapper, classes?.itemsWrapper)} style={menuStyles}>
                            <ul className={styles.itemsList} ref={this.setRef}>
                                { this.renderItems() }
                                { items?.length > 1 && tipMessage
                                    ? <div className={styles.tipBlock}>{tipMessage}</div>
                                    : void 0
                                }
                            </ul>
                            {isBlurred ? this.renderLoader() : null}
                        </div>
                    </Animation>
                </div>
            </WrapperComponent>
        );
    }
}

export default DropdownMenu;

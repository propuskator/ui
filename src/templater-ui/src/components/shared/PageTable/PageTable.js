import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import { checkIsSafari }        from './../../../utils/helpers/detect';
import EmptyList                from './../../shared/EmptyList';
import DropdownSelect           from './../../base/Dropdown/DropdownSelect';
import Loader                   from './../../base/Loader';
import IconButton               from './../../base/IconButton';
import SvgIcon                  from './../../base/SvgIcon';
import Tabs                     from './../../base/Tabs';
import Pagination               from './Pagination';

import styles                   from './PageTable.less';

const cx = classNames.bind(styles);

const DEFAULT_CELL_STYLES = {
    width : 100
};

const IS_SAFARI = checkIsSafari();

class PageTable extends PureComponent {
    static propTypes = {
        isLoading : PropTypes.bool,
        columns   : PropTypes.arrayOf(PropTypes.shape({

        })),
        items : PropTypes.arrayOf(PropTypes.shape({
            id     : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]).isRequired,
            fields : PropTypes.arrayOf(PropTypes.shape({
            }))
        })),
        tabsMode          : PropTypes.oneOf([ 'outside', '' ]),
        rowClassName      : PropTypes.string,
        perPage           : PropTypes.number,
        itemsCount        : PropTypes.number,
        currentPage       : PropTypes.number,
        tabs              : PropTypes.array,
        visibleColumns    : PropTypes.arrayOf(PropTypes.string),
        onChangeTab       : PropTypes.func,
        sortKey           : PropTypes.oneOf([ 'sort', 'sortedBy' ]),
        sortedBy          : PropTypes.string,
        order             : PropTypes.oneOf([ 'DESC', 'ASC', '' ]),
        onChangePage      : PropTypes.func.isRequired,
        setSortParams     : PropTypes.func.isRequired,
        renderControls    : PropTypes.func,
        setVisibleColumns : PropTypes.func,
        emptyListMessage  : PropTypes.any,
        isNothingFound    : PropTypes.bool
    }

    static defaultProps = {
        isLoading         : false,
        columns           : [],
        items             : [],
        visibleColumns    : [],
        rowClassName      : '',
        sortedBy          : '',
        order             : 'DESC',
        perPage           : 10,
        itemsCount        : 0,
        currentPage       : 0,
        tabs              : void 0,
        onChangeTab       : void 0,
        renderControls    : void 0,
        setVisibleColumns : void 0,
        emptyListMessage  : 'Nothing found',
        tabsMode          : void 0,
        isNothingFound    : false,
        sortKey           : 'sort'
    }

    constructor(props) {
        super(props);

        const configurableColumns = props?.columns  // eslint-disable-line  react/prop-types
            ?.filter(({ name, configurable }) => name && configurable)
            ?.map(({ name, component, label }) => ({ label: label || component, value: name }));

        this.state = {
            configurableColumns
        };
    }

    componentDidUpdate(prevProps) {
        const { isLoading } = this.props;

        if (!prevProps.isLoading  && isLoading) {
            if (!this?.tableRef || !this.loaderWrapperRef) return;

            this.loaderWrapperRef.style.left = `${this.tableRef.scrollLeft}px`;
        }
    }

    handleChangeColumnVisibility = ({ value }) => {
        const { setVisibleColumns } = this.props;

        if (setVisibleColumns) setVisibleColumns(value);
    }

    setSortParam = (sortParams) => () => {
        const { setSortParams, items } = this.props;

        if (!items?.length) return;

        setSortParams(sortParams);
    }

    renderTableHeader() {    /* eslint-disable-line max-lines-per-function */
        const { columns, sortedBy, sortKey, order, items, visibleColumns } = this.props;

        if (!columns) return null;

        return  (
            <div className={styles.headerWrapper}>
                <div className={styles.header}>
                    { columns.map(column => {    /* eslint-disable-line max-lines-per-function */
                        const {
                            name      = '',
                            className = '',
                            style     = DEFAULT_CELL_STYLES,
                            component : Component,
                            align     = 'center',
                            sortable,
                            configurable
                        } = column;

                        if (configurable && !visibleColumns?.includes(name)) return void 0;

                        const CellComponent = Component
                            ? Component
                            : null;

                        const columnCN = cx(styles.cell, {
                            className,
                            [styles[align]] : align,
                            sortable        : sortable && items.length
                        });

                        return (
                            <div
                                key       = {name}
                                className = {columnCN}
                                style     = {style}
                                onClick   = {sortable && items.length ? this.setSortParam({
                                    [sortKey] : name,
                                    order     : order === 'ASC' || sortedBy !== name ? 'DESC' : 'ASC'
                                }) : undefined}
                            >
                                { align === 'right' && sortable
                                    ? (
                                        <IconButton
                                            disableFocusRipple
                                            className = {cx({
                                                sortIconButton  : true,
                                                left            : true,
                                                [styles.hidden] : !items.length
                                            })}
                                            onClick   = {this.setSortParam({
                                                [sortKey] : name,
                                                order     : order === 'ASC' || sortedBy !== name ? 'DESC' : 'ASC'
                                            })}
                                        >
                                            <SvgIcon
                                                className = {cx(styles.sortIcon, {
                                                    rotated : sortedBy === name && order === 'ASC'
                                                })}
                                                color     = {sortedBy === name ? 'primary700' : 'greyMedium'}
                                                type      = 'sortArrow'
                                            />
                                        </IconButton>
                                    )
                                    : null
                                }
                                {CellComponent}
                                { (!align || [ 'center', 'left' ].includes(align)) && sortable
                                    ? (
                                        <IconButton
                                            className = {cx({
                                                sortIconButton  : true,
                                                right           : true,
                                                [styles.hidden] : !items.length
                                            })}
                                            disableFocusRipple
                                            onClick   = {this.setSortParam({
                                                [sortKey] : name,
                                                order     : order === 'ASC' || sortedBy !== name ? 'DESC' : 'ASC'
                                            })}
                                        >
                                            <SvgIcon
                                                className = {cx(styles.sortIcon, {
                                                    rotated : sortedBy === name && order === 'ASC'
                                                })}
                                                type      = 'sortArrow'
                                                color     = {sortedBy === name ? 'primary700' : 'greyMedium'}
                                            />
                                        </IconButton>
                                    )
                                    : null
                                }
                            </div>
                        );
                    }) }
                </div>
            </div>
        );
    }

    renderRows = () => {
        const { items, isLoading } = this.props;

        if (!items.length && isLoading) return null;

        return (
            <div className={styles.rows}>
                <div className={styles.rowsFlex}>
                    { items.map((item, index) => this.renderRow(item, index)) }
                </div>
            </div>
        );
    }

    renderRow = (rowData, index) => {
        const { fields, id, is_archived, onClick } = rowData;
        const { columns, rowClassName, currentPage, visibleColumns } = this.props;
        const rowCN = cx(styles.row, {
            [rowClassName]       : rowClassName,
            [rowData?.className] : rowData?.className,
            'archived'           : is_archived,
            clickable            : onClick
        });

        return (
            <div
                className = {styles.rowWrapper}
                key       = {`row${index}${currentPage}${id}`}
            >
                <div className = {rowCN}>
                    { columns.map((columnData, cellIndex) => {
                        const { className, name, align, style = DEFAULT_CELL_STYLES, configurable } = columnData;

                        if (configurable && !visibleColumns?.includes(name)) return void 0;

                        const cellData = fields[cellIndex] || {};

                        const { component: Component, componentType, preventClick }  = cellData;

                        const CellComponent = Component
                            ? Component
                            : null;

                        const isPreventClick = !!onClick && !!preventClick;

                        const cellCN = cx(styles.cell, {
                            [className]   : className,
                            preventClick  : isPreventClick,
                            notSelectable : !!onClick && !isPreventClick
                        });

                        const cellComponentWrapperCN = cx(styles.cellComponentWrapper, {
                            [styles[componentType]] : !!componentType,
                            [styles[align]]         : !!align,
                            withOpacity             : ![
                                'switch', 'defaultActions', 'button'
                            ].includes(componentType)
                        });

                        function handlePreventClick(e) {
                            if (e) e.preventDefault();
                            if (e) e.stopPropagation();
                        }

                        return (
                            <div
                                className = {cellCN}
                                key       = {`${name}${cellIndex}${index}`} // eslint-disable-line react/no-array-index-key
                                style     = {{ ...style }}
                                onClick   = {isPreventClick ? handlePreventClick : onClick}
                            >
                                <div className={cellComponentWrapperCN}>
                                    { CellComponent }
                                </div>
                            </div>
                        );
                    }) }
                </div>
            </div>
        );
    }

    renderFooter = ({ isBlurred = false } = {}) => {
        return (
            <div className={cx(styles.footer, {  blurred: isBlurred })}>
                <div className={styles.controlsWrapper}>
                    { this.renderPagination() }
                </div>
            </div>
        );
    }

    renderPagination = () => {
        const { perPage, currentPage, itemsCount, onChangePage } = this.props;

        if (!itemsCount) return null;

        return (
            <div className = {styles.paginationWrapper}>
                <Pagination
                    rowsTotalCount = {itemsCount}
                    rowsPerPage    = {perPage}
                    currentPage    = {currentPage}
                    onChangePage   = {onChangePage}
                />
            </div>
        );
    }

    renderLoader = () => {
        return (
            <div className={styles.loaderWrapper} ref={node => this.loaderWrapperRef = node}>
                <Loader size = 'S' />
            </div>
        );
    }

    renderEmptyList() {
        const { items, isNothingFound, emptyListMessage, isLoading } = this.props;

        if (items?.length) return null;

        if (isLoading) return null;

        return (
            <div className={styles.emptyListWrapper}>
                <EmptyList iconType={isNothingFound ? 'nothingFound' : 'emptyList'}>
                    { emptyListMessage }
                </EmptyList>
            </div>
        );
    }

    render() {
        const {
            items, isLoading, tabs, onChangeTab,
            tabsMode, renderControls, visibleColumns
        } = this.props;

        const { configurableColumns } = this.state;

        const tableCN = cx(styles.Table, {
            emptyList : !items.length
        });
        const tableRowsWrapperCN = cx(styles.tableRowsWrapper, {
            emptyTableRowsWrapper : !items.length
        });
        const isBlurred = isLoading && items.length;

        const tableContentCN = cx(styles.tableContent, {
            loading   : isLoading,
            emptyList : !items.length
        });

        const tableWrapperCN = cx(styles.tableWrapper, {
            [styles.blurred] : isBlurred,
            safari           : IS_SAFARI
        });

        return (
            <>
                <div className={tableWrapperCN}>
                    { tabs || renderControls
                        ? (
                            <div
                                className={cx(styles.pageHeading, {
                                    twoBlocks : tabs && renderControls
                                })}>
                                { tabs
                                    ? (
                                        <div className={styles.tabsWrapper}>
                                            <Tabs
                                                className = {styles.tabs}
                                                tabs      = {tabs}
                                                onChange  = {onChangeTab}
                                                tabsMode  = {tabsMode}
                                            />
                                        </div>
                                    )
                                    : null
                                }

                                <div className={styles.controlsPart}>
                                    { renderControls
                                        ? <div className={styles.controlsWrapper}>{renderControls()}</div>
                                        : null
                                    }

                                    {
                                        configurableColumns?.length
                                            ? <DropdownSelect
                                                className = {styles.columnsSelect}
                                                onChange  = {this.handleChangeColumnVisibility}
                                                options   = {configurableColumns}
                                                value     = {visibleColumns}
                                            />
                                            : null
                                    }
                                </div>
                            </div>
                        ) : null
                    }

                    <div className={tableContentCN}>
                        <div className={tableCN} ref={node => this.tableRef = node}>
                            { this.renderTableHeader() }
                            <div className={styles.tableBodyWrapper}>
                                <div className={tableRowsWrapperCN}>
                                    { this.renderRows() }
                                </div>
                                { isBlurred || isLoading
                                    ? this.renderLoader()
                                    : null
                                }
                            </div>
                        </div>
                        {this.renderEmptyList()}
                    </div>
                </div>
                { this.renderFooter({ isBlurred }) }
            </>
        );
    }
}

export default PageTable;

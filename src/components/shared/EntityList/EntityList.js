/* eslint-disable no-magic-numbers, more/no-duplicated-chains */

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import InfiniteScroll           from 'react-infinite-scroller';

import InputSearch              from 'templater-ui/src/components/base/Input/InputSearch';
import IconButton               from 'templater-ui/src/components/base/IconButton';
import Loader                   from 'templater-ui/src/components/base/Loader';
import Chip                     from 'templater-ui/src/components/base/Chip';

import {
    sortByIsArchived
}                               from 'Utils/sort';
import DragItem                 from 'Shared/DraggableList/DragItem';
import SvgIcon                  from 'Base/SvgIcon';
import ExpansionPanel           from 'Base/ExpansionPanel';

import styles                   from './EntityList.less';

const cx = classnames.bind(styles);


class EntityList extends PureComponent {
    static propTypes = {
        className       : PropTypes.string,
        listClassName   : PropTypes.string,
        name            : PropTypes.string,
        emptyMessage    : PropTypes.string.isRequired,
        onAddEntity     : PropTypes.func,
        onCreateEntity  : PropTypes.func,
        onSetGrabbingId : PropTypes.func,
        isFetching      : PropTypes.bool,
        expandedKey     : PropTypes.string,
        list            : PropTypes.arrayOf(PropTypes.shape({
            id           : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
            name         : PropTypes.string.isRequired,
            isExpandable : PropTypes.bool
        })),
        grabbing          : PropTypes.bool,
        expanded          : PropTypes.bool,
        useUniqueId       : PropTypes.bool,
        searchLabel       : PropTypes.string.isRequired,
        renderItem        : PropTypes.func,
        renderItemDetails : PropTypes.func,
        color             : PropTypes.oneOf([
            'lightGreen', 'lightViolet', 'lightRed',
            'lightYellow', 'lightOrange', ''
        ]),
        searchRef : PropTypes.shape({
            current : PropTypes.object
        }),
        forwardRef : PropTypes.shape({
            current : PropTypes.object
        }),
        autoFocus     : PropTypes.bool,
        isProcessing  : PropTypes.bool,
        requiredError : PropTypes.bool,
        updateSearch  : PropTypes.func,
        search        : PropTypes.string,
        size          : PropTypes.oneOf([ 'S', '' ]),
        refreshList   : PropTypes.func,
        countToLoad   : PropTypes.number,
        initialMeta   : PropTypes.shape({
            sortedBy : PropTypes.string
        }),
        t        : PropTypes.func,
        selected : PropTypes.array
    };

    static defaultProps = {
        className         : '',
        listClassName     : '',
        name              : '',
        list              : [],
        color             : 'lightGreen',
        grabbing          : true,
        expanded          : true,
        autoFocus         : false,
        isProcessing      : false,
        requiredError     : false,
        isFetching        : false,
        useUniqueId       : false,
        onCreateEntity    : void 0,
        onAddEntity       : void 0,
        onSetGrabbingId   : void 0,
        renderItem        : void 0,
        renderItemDetails : void 0,
        searchRef         : void 0,
        forwardRef        : void 0,
        updateSearch      : void 0,
        refreshList       : void 0,
        countToLoad       : 20,
        initialMeta       : {
            sortedBy : 'popularityCoef'
        },
        search      : '',
        expandedKey : '',
        size        : '',
        t           : (text) => text,
        selected    : []
    }

    constructor(props) {
        super(props);

        this.isInitialized = false;

        const { forwardRef, refreshList } = props;

        this.state = {
            isLoading : !!refreshList,
            total     : 0,
            meta      : {
                ...props.initialMeta,
                search : props?.search || '',
                limit  : props.countToLoad,
                offset : 0
            }
        };

        if (forwardRef) {
            forwardRef.current = {
                changeTotalCount : this.changeTotalCount
            };
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    changeTotalCount = ({ type = 'increase', value }) => {
        let nextTotal = value;
        const isTypeExist = [ 'increase', 'decrease' ].includes(type);


        if (!isTypeExist) {
            const { total = 0 } = this.state;

            nextTotal = type === 'increase' ? total + 1 : total - 1;
        }

        this.setState({
            total : nextTotal
        });
    }

    handleSetGrabbingId = (id) => {
        const { onSetGrabbingId } = this.props;

        if (onSetGrabbingId) onSetGrabbingId(id);
    }

    handleChangeSearch = ({ value }) => {
        const { updateSearch, name } = this.props;

        if (updateSearch) updateSearch({ name, value });

        if (this.state?.meta?.search === value) return;
        if (!this.state?.meta?.search && !value) return;

        const { countToLoad } = this.props;
        const requestParams = {
            limit  : countToLoad,
            offset : 0,
            search : value
        };

        this.fetchData(requestParams);

        this.setState({
            meta : requestParams
        });
    }

    onLoadMore = () => {
        const { meta } = this.state;
        const { countToLoad } = this.props;
        const newMeta  = {
            ...meta,
            limit  : countToLoad,
            offset : meta?.offset + countToLoad
        };

        this.fetchData(newMeta);
    }

    fetchData = async (params = this.state.meta) => {
        if (this.state.isLoading && this.isInitialized) return;
        if (params?.offset > this.state?.total && this.state?.total) return;

        const { refreshList, value } = this.props;

        if (!refreshList) return;
        this.setState({
            isLoading : true,
            meta      : { ...this.state.meta, ...params }
        });

        try {
            const { meta, data = [] }  = await refreshList({
                ...params,
                isMergeList : params?.offset !== 0
            });
            const itemsToLoad = [];

            if (value && value?.length && !params?.search) {
                const itemsIds = data?.map(item => item.id) || [];

                value.forEach(itemId => {
                    if (!itemsIds.includes(itemId)) {
                        itemsToLoad.push(itemId);
                    }
                });
            }

            if (itemsToLoad?.length) {
                await refreshList({
                    ids         : itemsToLoad,
                    isMergeList : true
                });
            }

            this.setState({
                total     : meta?.filteredCount,
                isLoading : false
            });
        } catch (error) {
            console.error({ error });
            this.setState({ isLoading: false });
        } finally {
            this.isInitialized = true;
        }
    }

    renderSummaryContent = (item) => {
        const { t } = this.props;

        return (
            <>
                <Chip
                    className  = {styles.chip}
                    background = {item.color}
                    t          = {t}
                >
                    {item.name}
                </Chip>
            </>
        );
    }

    renderList = (list) => {
        const { listClassName, refreshList, countToLoad, selected } = this.props;
        const { isLoading, meta, total } = this.state;
        const listWrapperCN = cx(styles.listWrapper, {
            [listClassName] : listClassName
        });

        if (!refreshList && list?.length) {
            return (
                <div className={listWrapperCN}>
                    <div className={styles.list}>
                        { list?.map(this.renderListItem) }
                    </div>
                </div>
            );
        }

        if (isLoading && !this.isInitialized) return null;

        const countToLoadMore = Math.round(countToLoad / 2);    // eslint-disable-line no-magic-numbers

        // load more if user select items
        if (!isLoading && total > list?.length && list?.length === countToLoadMore) {
            this.onLoadMore();
        } else if (!isLoading && selected?.length + list?.length < total) {
            // подгрузить еще если скролла и onLoadMore при скролле не может быть вызван
            this.onLoadMore();
        }

        if (!list?.length) return;

        return (
            <div className={listWrapperCN}>
                <InfiniteScroll
                    pageStart   = {0}
                    loadMore    = {this.onLoadMore}
                    hasMore     = {!isLoading && total > meta?.offset}
                    useWindow   = {false}
                    loader      = {null}
                    initialLoad = {false}
                >
                    <div className={styles.list}>
                        { list.map(this.renderListItem) }
                        { isLoading && meta?.offset !== 0
                            ? (
                                <div className={styles.loadMoreIndicator}>
                                    <Loader className={styles.loader} size = 'XS' />
                                </div>
                            ) : null
                        }
                    </div>
                </InfiniteScroll>
            </div>
        );
    }

    renderListItem = (item) => {    /* eslint-disable-line max-lines-per-function */
        const {
            grabbing, expanded, renderItem, expandedKey, useUniqueId,
            onAddEntity, renderItemDetails, t
        }  = this.props;
        const expandedList = item[expandedKey]
            ? sortByIsArchived(item[expandedKey] || [])
            : [];

        if (!grabbing && !expanded) {
            return (
                <div
                    key       = {`${item?.id}${item?.name}`}
                    className = {cx(styles.summary)}
                >
                    { onAddEntity
                        ? (
                            <IconButton
                                className     = {styles.addEntityButton}
                                onClick       = {() => {    // eslint-disable-line react/jsx-no-bind
                                    if (item?.uniqueId) onAddEntity(item?.uniqueId, true);
                                    else onAddEntity(item.id);
                                }}
                                iconType      = 'plusButton'
                                iconClassName = {styles.plusButton}
                            />
                        ) : null
                    }
                    { renderItem
                        ? renderItem(item)
                        : this.renderSummaryContent(item)
                    }
                </div>
            );
        }

        const isExpandable = item.isExpandable;

        return (
            <DragItem
                key         = {`${item?.id}${item?.name}`}
                id          = {useUniqueId ? item.uniqueId : item.id}
                onDragStart = {this.handleSetGrabbingId}
                onDragEnd   = {this.handleSetGrabbingId}
            >
                <ExpansionPanel
                    className        = {styles.expansionPanel}
                    disableExpansion = {expandedList.length === 0 && !isExpandable}
                    summary          = {
                        <div
                            className={cx(styles.summary, {
                                expandable    : item.isExpandable || (expandedKey && expandedList?.length),
                                notExpandable : !item.isExpandable && (expandedKey && !expandedList?.length)
                            })}
                        >
                            { onAddEntity
                                ? (
                                    <IconButton
                                        className     = {styles.addEntityButton}
                                        onClick       = {() => {    // eslint-disable-line react/jsx-no-bind
                                            if (item?.uniqueId) onAddEntity(item?.uniqueId, true);
                                            else onAddEntity(item.id);
                                        }}
                                        iconType      = 'plusButton'
                                        iconClassName = {styles.plusButton}
                                    />
                                ) : null
                            }
                            { renderItem
                                ? renderItem(item)
                                : this.renderSummaryContent(item, isExpandable)
                            }
                        </div>
                    }
                    details  = {
                        <div className={styles.details}>
                            { renderItemDetails
                                ? renderItemDetails(item)
                                : (
                                    expandedList.map(expandedItem => (
                                        <Chip
                                            key = {`${expandedItem.id}${expandedItem.name}`}
                                            className  = {styles.detailsSimpleItem}
                                            color      = 'green'
                                            variant    = 'outlined'
                                            isArchived = {expandedItem?.isArchived}
                                            t          = {t}
                                            size       = 'S'
                                        >
                                            {expandedItem.name}
                                        </Chip>
                                    ))
                                )
                            }
                        </div>
                    }
                />
            </DragItem>
        );
    }

    render() {    /* eslint-disable-line max-lines-per-function */
        const {
            list = [],
            emptyMessage,
            onCreateEntity,
            searchLabel,
            autoFocus,
            searchRef,
            className,
            search,
            color,
            isProcessing,
            requiredError,
            size,
            refreshList,
            isFetching,
            t
        } = this.props;

        const { isLoading, meta } = this.state;


        const isEntityLoading = refreshList
            ? (!list?.length || (meta?.search && meta?.offset === 0) || !this.isInitialized) && isLoading
            : isFetching || isLoading;

        const filteredList = list.filter(item => item?.name?.toLowerCase()?.includes(search?.toLowerCase()));

        const isSidebarEmpty = refreshList
            ? !filteredList?.length || (isEntityLoading && !this.isInitialized)
            : !filteredList?.length;
        const isSearchMode = search?.trim()?.length || false;

        const entityListWrapperCN = cx(styles.entityListWrapper, {
            emptyList       : isSidebarEmpty,
            blurred         : isEntityLoading && !isSidebarEmpty,
            processing      : isProcessing,
            [color]         : color,
            [className]     : className,
            [`size${size}`] : !!size,
            requiredError
        });

        return (
            <div className={entityListWrapperCN}>
                <div className={styles.heading}>
                    <div className = {cx(styles.searchField, { withControls: onCreateEntity })}>
                        <InputSearch
                            label      = {searchLabel}
                            name       = 'search'
                            value      = {search}
                            onChange   = {this.handleChangeSearch}
                            autoFocus  = {autoFocus}
                            ref        = {searchRef}
                            withError  = {false}
                        />
                    </div>
                    { onCreateEntity
                        ? (
                            <IconButton
                                className = {styles.createEntityButton}
                                onClick   = {onCreateEntity}
                                iconType  = 'plusButton'
                            />
                        ) : null
                    }
                </div>
                { this.renderList(filteredList) }

                { isEntityLoading
                    ? (
                        <div className={styles.loaderWrapper}>
                            <Loader size = 'S' />
                        </div>
                    ) : null
                }

                { !isEntityLoading && isSidebarEmpty
                    ? (
                        <div className={styles.emptyListWrapper}>
                            <SvgIcon
                                type      = {isSearchMode ? 'nothingFound' : 'emptyList'}
                                className = {styles.emptyListIcon}
                                color     = 'greyMedium'
                            />
                            <div className={styles.message}>
                                {isSearchMode ? t('Nothing found') : emptyMessage}
                            </div>
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default EntityList;

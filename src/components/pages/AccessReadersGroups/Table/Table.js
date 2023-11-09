import React, {
    useState,
    useMemo,
    useCallback,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';

import PageTable                from 'templater-ui/src/components/shared/PageTable';
import Tooltip                  from 'templater-ui/src/components/base/Tooltip';
import Switch                   from 'templater-ui/src/components/base/Switch';
import Chip                     from 'templater-ui/src/components/base/Chip';

import {
    getRelativeTime,
    formatDate
}                               from 'Utils/date';
import { sortComparator }       from 'Utils/sort';
import { TOASTS_KEYS }          from 'Constants/toasts';
import ExpandedChipsList        from 'Shared/ExpandedChipsList';
import DefaultActions           from 'Shared/PageTable/DefaultActions';
import * as ROUTES              from 'Constants/routes';
import history                  from 'History';

import styles                   from './Table.less';

function Table(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        openModal, updateItem, changeFilters, filters, timezone,
        list, total, limit, offset, isLoading, fetchItems, addToast,
        t, closeModal, deleteItem
    } = props;
    const {
        sortedBy, order, isArchived, search,
        enabled, updateStart, updateEnd, createStart, createEnd
    } = filters;
    const [ processingFields, setProcessingFields ] = useState([]);

    useEffect(() => () => handleChangePage(1), []);

    function showUpdateItemToast(isSuccess) {
        if (isSuccess) {
            addToast({
                key     : TOASTS_KEYS.accessTokenReaderUpdate,
                title   : t('Action was completed successfully'),
                message : t('readers-groups-page:Space has been updated'),
                type    : 'success'
            });
        } else {
            addToast({
                key     : TOASTS_KEYS.accessTokenReaderUpdate,
                title   : t('Something went wrong'),
                message : t('readers-groups-page:Space hasn\'t been updated'),
                type    : 'error'
            });
        }
    }

    async function withProcessing(promise, fieldId) {
        setProcessingFields(fields => ([ ...fields, fieldId ]));

        try {
            await promise;
        } catch (error) {    // eslint-disable-line no-useless-catch
            throw error;
        } finally {
            setProcessingFields(fields => fields.filter(field =>  field !== fieldId));
        }
    }

    function handleToggleEnabled(itemId) {
        return async ({ name, value }) => {
            try {
                await withProcessing(
                    updateItem({ id: itemId, [name]: value  }),
                    `enabled${itemId}`
                );
                await fetchItems();
                // showUpdateItemToast(true);
            } catch (error) {
                showUpdateItemToast(false);
            }
        };
    }

    function refreshList() {
        fetchItems();
    }

    function editItem(itemId) {
        openModal('accessReadersGroup', {
            onClose : ({ entity } = {}) => {
                if (entity) refreshList();
            },
            entityId : itemId
        });
    }

    async function unzipItem(itemId) {
        try {
            await withProcessing(
                updateItem({ id: itemId, isArchived: false }),
                `zip${itemId}`
            );
            await fetchItems(filters);
            showUpdateItemToast(true);
        } catch (error) {
            showUpdateItemToast(false);
        }
    }

    async function archiveItem(itemId) {
        try {
            await withProcessing(
                updateItem({ id: itemId, isArchived: true }),
                `zip${itemId}`
            );
            await fetchItems(filters);
            showUpdateItemToast(true);
        } catch (error) {
            showUpdateItemToast(false);
        }
    }

    const handleRunAction = (item, action) => () => {  // eslint-disable-line func-style
        if (!item) return;

        switch (action) {
            case 'edit':
                return editItem(item?.id, item);
            case 'unzip':
                return unzipItem(item?.id, item);
            case 'archive':
                return handleArchiveEntity(item);
            case 'delete':
                return handleOpenDeleteModal(item);
            default:
                return null;
        }
    };

    function handleArchiveEntity(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('readers-groups-page:Hide space'),
            message      : t('readers-groups-page:The space will be automatically turned off after hiding.'),
            cancelLabel  : t('Cancel'),
            confirmLabel : t('Hide'),
            onSubmit     : async () => {
                try {
                    await archiveItem(item?.id, item);
                    closeModal('confirm');
                } catch (error) {
                    console.error(error);
                }
            },
            onCancell : () => closeModal('confirm')
        });
    }

    function handleOpenDeleteModal(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('readers-groups-page:Delete space'),
            message      : t('readers-groups-page:The space will be deleted. You cannot undo this action via web application.'),
            cancelLabel  : t('Cancel'),
            confirmLabel : t('Delete'),
            onSubmit     : async () => {
                try {
                    await deleteItem({ id: item?.id });
                    await fetchItems();
                    closeModal('confirm');
                } catch (error) {
                    console.error(error);
                }
            },
            onCancell : () => closeModal('confirm')
        });
    }

    function getTableData(list = []) {  // eslint-disable-line no-shadow, max-lines-per-function
        const NODES_LIST_COLUMNS = [
            {
                name      : 'name',
                component : t('tables:Name'),
                align     : 'left',
                sortable  : true,
                style     : {
                    width   : '200px',
                    padding : '5px 10px 5px 25px'
                }
            }, {
                name      : 'readersGroups',
                component : (
                    <div className={styles.readersGroupsWrapper}>
                        <div className={styles.label}>
                            {t('Access points')}
                        </div>
                    </div>
                ),
                align    : 'left',
                sortable : false,
                style    : {
                    width    : 'calc(100% - 800px)',   // 730px = 200+90+185+160+160
                    minWidth : '180px',
                    padding  : '3px 10px'
                }
            }, {
                name      : 'enabled',
                component : t('tables:Status'),
                align     : 'right',
                sortable  : true,
                style     : {
                    width : '90px'
                }
            }, {
                name      : 'action',
                component : '',
                align     : null,
                sortable  : false,
                style     : {
                    width   : '185px',
                    padding : '0 5px 0 5px'
                }
            }, {
                name      : 'updatedAt',
                component : t('tables:Edited'),
                align     : 'right',
                sortable  : true,
                style     : {
                    minWidth : '165px'
                }
            }, {
                name      : 'createdAt',
                component : t('tables:Created'),
                align     : 'right',
                sortable  : true,
                style     : {
                    minWidth : '160px',
                    padding  : '5px 25px 5px 10px'
                }
            }
        ];

        const items = [];
        const PER_PAGE = 10;

        list.slice(0, PER_PAGE).forEach((item) => {  // eslint-disable-line  max-lines-per-function
            const tableItem = {
                id         : item.id,
                isArchived : item.isArchived,
                fields     : [ {
                    componentType : 'chip',
                    component     : (
                        item?.name
                            ? (
                                <Chip
                                    className      = {styles.chip}
                                    background     = {item?.color}
                                    tooltipContent = {item?.name}
                                    t              = {t}
                                >
                                    { item?.name }
                                </Chip>
                            ) : '-'
                    )
                }, {
                    componentType : 'accessTokenReaders',
                    component     : item.accessTokenReaders?.length
                        ? (
                            <ExpandedChipsList
                                list={item?.accessTokenReaders?.sort((a, b) => {
                                    const firstLabel  = a?.name?.toLowerCase() || '';
                                    const secondLabel = b?.name?.toLowerCase() || '';

                                    return sortComparator(firstLabel, secondLabel, 'ASC');
                                })?.map(entity => ({
                                    id      : entity.id,
                                    key     : `${item.id}${entity.id}`,
                                    label   : entity.name,
                                    color   : 'green',
                                    variant : 'outlined',
                                    item    : entity
                                }))}
                            />
                        ) : '—'
                }, {
                    componentType : 'switch',
                    component     : (
                        <Tooltip title={item.enabled ? t('tables:Enabled') : t('tables:Disabled')}>
                            <div className={styles.switchWrapper}>
                                <Switch
                                    name         = 'enabled'
                                    value        = {item.enabled}
                                    isProcessing = {processingFields.includes(`enabled${item.id}`)}
                                    isDisabled   = {!!item?.isArchived}
                                    onChange     = {handleToggleEnabled(item.id)}
                                    disabled     = {item.isArchived}
                                />
                            </div>
                        </Tooltip>
                    )
                }, {
                    componentType : 'defaultActions',
                    component     : (
                        <DefaultActions
                            item            = {item}
                            handleRunAction = {handleRunAction} // eslint-disable-line react/jsx-no-bind
                            t               = {t}
                        />
                    )
                },
                {
                    componentType : 'text',
                    component     : (
                        <Tooltip
                            title     = {formatDate({ date: item.updatedAt, timezone })}
                            placement = 'bottom-end'
                            ariaLabel = 'updated at date'
                        >
                            <div>
                                { getRelativeTime(item.updatedAt, { timezone }) || '-' }
                            </div>
                        </Tooltip>
                    )

                }, {
                    componentType : 'text',
                    component     : (
                        <Tooltip
                            title     = {formatDate({ date: item.createdAt, timezone })}
                            placement = 'bottom-end'
                            ariaLabel = 'created at date'
                        >
                            <div>
                                { getRelativeTime(item.createdAt, { timezone }) || '-' }
                            </div>
                        </Tooltip>
                    )
                } ]
            };

            items.push(tableItem);
        });

        return {
            columns : NODES_LIST_COLUMNS,
            items
        };
    }

    function handleChangeTab({ value }) {
        history.push(ROUTES.ACCESS_READERS_GROUPS);

        switch (value) {
            case 'archived':
                return changeFilters({ isArchived: true, offset: 0 });
            case 'notArchived':
                return changeFilters({ isArchived: false, offset: 0 });
            case 'all':
                return changeFilters({ isArchived: void 0, offset: 0 });
            default:
                return null;
        }
    }

    function handleChangePage(page) {
        const offset = page > 0 ? (page - 1) * filters.limit : 0;   // eslint-disable-line no-shadow

        changeFilters({ offset });
    }

    const { columns, items } = getTableData(list);
    const currentPage = Math.floor(offset / limit) + 1;
    const isNothingFound = !!(search?.trim()?.length
        || [ true, false ].includes(enabled) || (updateStart && updateEnd)
        || (createStart && createEnd));

    return (
        <PageTable
            columns          = {columns}
            items            = {items}
            itemsCount       = {total}
            perPage          = {limit}
            isLoading        = {isLoading}
            currentPage      = {currentPage}
            emptyListMessage = {!isNothingFound
                ? (
                    <div>
                        {t('readers-groups-page:No spaces to display')} <br />
                        {t('readers-groups-page:You can create a new space')}
                    </div>
                ) : t('tables:Nothing found')
            }
            isNothingFound = {!!isNothingFound}
            onChangePage   = {useCallback(handleChangePage, [])}
            onChangeTab    = {useCallback(handleChangeTab, [])}
            sortedBy       = {sortedBy}
            order          = {order}
            setSortParams  = {useCallback(changeFilters, [])}
            sortKey        = 'sortedBy'
            tabs           = {useMemo(() => ([ {
                label    : t('tables:Not archived'),
                value    : 'notArchived',
                isActive : isArchived === false
            },  {
                label    : t('tables:Archived'),
                value    : 'archived',
                isActive : isArchived === true
            },  {
                label    : t('tables:All'),
                value    : 'all',
                isActive : isArchived !== false && !isArchived
            } ]), [ isArchived ])}
        />
    );
}

Table.propTypes = {
    list    : PropTypes.array,
    filters : PropTypes.shape({
        sortedBy              : PropTypes.string,
        order                 : PropTypes.string,
        search                : PropTypes.string,
        isArchived            : PropTypes.bool,
        accessReadersGroupIds : PropTypes.array
    }).isRequired,
    limit         : PropTypes.number.isRequired,
    offset        : PropTypes.number.isRequired,
    isLoading     : PropTypes.bool.isRequired,
    total         : PropTypes.number.isRequired,
    openModal     : PropTypes.func.isRequired,
    updateItem    : PropTypes.func.isRequired,
    fetchItems    : PropTypes.func.isRequired,
    changeFilters : PropTypes.func.isRequired,
    addToast      : PropTypes.func.isRequired,
    timezone      : PropTypes.string,
    t             : PropTypes.func.isRequired,
    deleteItem    : PropTypes.func.isRequired,
    closeModal    : PropTypes.func.isRequired
};


Table.defaultProps = {
    list     : [],
    timezone : void 0
};

export default Table;

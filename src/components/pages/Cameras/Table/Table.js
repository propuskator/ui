import React, {
    useState,
    useCallback,
    useMemo,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';

import { EMPTY_TEXT }           from 'templater-ui/src/constants/index';
import PageTable                from 'templater-ui/src/components/shared/PageTable';
import Tooltip                  from 'templater-ui/src/components/base/Tooltip';
import Switch                   from 'templater-ui/src/components/base/Switch';
import Chip                     from 'templater-ui/src/components/base/Chip';
import Button                   from 'templater-ui/src/components/base/Button';

import {
    getRelativeTime,
    formatDate
}                               from 'Utils/date';
import { sortComparator }       from 'Utils/sort';
import { TOASTS_KEYS }          from 'Constants/toasts';
import * as ROUTES              from 'Constants/routes';
import history                  from 'History';
import DefaultActions           from 'Shared/PageTable/DefaultActions';
import ExpandedChipsList        from 'Shared/ExpandedChipsList';
import CameraStatus             from 'Shared/CameraStatus';
import SvgIcon                  from 'Base/SvgIcon';

import styles                   from './Table.less';

function Table(props) { // eslint-disable-line max-lines-per-function
    const {
        openModal, updateItem, changeFilters, filters,
        list, total, limit, offset, isLoading, fetchItems, addToast,
        timezone, t, deleteItem, closeModal, setVisibleColumns, visibleColumns
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
                key     : TOASTS_KEYS.camerasUpdate,
                title   : t('Action was completed successfully'),
                message : t('cameras-page:Camera has been updated'),
                type    : 'success'
            });
        } else {
            addToast({
                key     : TOASTS_KEYS.camerasUpdate,
                title   : t('Something went wrong'),
                message : t('cameras-page:Camera hasn\'t been updated'),
                type    : 'error'
            });
        }
    }

    async function withProcessing(promise, fieldId) {
        setProcessingFields(fields => ([ ...fields, fieldId ]));

        try {
            await promise;
        } catch (error) {   // eslint-disable-line no-useless-catch
            throw error;
        } finally {
            setProcessingFields(fields => fields.filter(field =>  field !== fieldId));
        }
    }

    function handleToggleEnabled(itemId) {
        return async ({ name, value }) => {
            try {
                await withProcessing(
                    updateItem({ id: itemId, data: { [name]: value } }),
                    `enabled${itemId}`
                );
                await fetchItems();
                // showUpdateItemToast(true);
            } catch (error) {
                showUpdateItemToast(false);
            }
        };
    }

    function editItem(itemId) {
        openModal('camera', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchItems();
            },
            entityId : itemId
        });
    }

    async function unzipItem(itemId) {
        try {
            await withProcessing(
                updateItem({ id: itemId, data: { isArchived: false } }),
                `selected${itemId}`
            );
            // showUpdateItemToast(true);
            await fetchItems();
        } catch (error) {
            showUpdateItemToast(false);
        }
    }

    async function archiveItem(itemId) {
        try {
            await withProcessing(
                updateItem({ id: itemId, data: { isArchived: true } }),
                `selected${itemId}`
            );
            // showUpdateItemToast(true);
            await fetchItems();
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
            case 'preview':
                return handleOpenPreviewModal(item);
            default:
                return null;
        }
    };

    function handleArchiveEntity(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('cameras-page:Hide camera'),
            message      : t('cameras-page:The camera will be automatically turned off after hiding.'),
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

    function handleOpenPreviewModal(item) {
        // in dev mode replace wss -> ws
        // const link = (item?.wssStreamUrl || '')?.replace(/^wss/, 'ws');

        return () => {
            openModal('cameraStream', {
                link   : item?.wssStreamUrl,
                item,
                poster : item?.poster
            });
        };
    }

    function handleOpenDeleteModal(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('cameras-page:Delete camera'),
            message      : t('cameras-page:The camera will be deleted. You cannot undo this action via web application.'),
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

    function getTableData(list = [ ]) { // eslint-disable-line max-lines-per-function, no-shadow
        const NODES_LIST_COLUMNS = [
            {
                name      : 'activeAt',
                component : '',
                align     : 'left',
                sortable  : false,
                style     : {
                    width   : '55px',
                    padding : '5px 0px 5px 16px'
                }
            }, {
                name      : 'name',
                component : t('Name'),
                align     : 'left',
                sortable  : true,
                style     : {
                    width   : '180px',
                    padding : '5px 10px 5px 25px'
                }
            }, {
                name      : 'tokenReaders',
                component : t('Access points'),
                align     : 'left',
                sortable  : false,
                style     : {
                    width    : 'calc(100% - 950px)',   // 950px = 180+120+90+185+160+160+55
                    minWidth : '180px'
                }
            }, {
                name      : 'previewButton',
                component : '',
                align     : 'right',
                sortable  : false,
                style     : {
                    width : '120px'
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
                name         : 'updatedAt',
                component    : t('tables:Edited'),
                align        : 'right',
                sortable     : true,
                configurable : true,
                style        : {
                    width : '160px'
                }
            }, {
                name         : 'createdAt',
                component    : t('tables:Created'),
                align        : 'right',
                sortable     : true,
                configurable : true,
                style        : {
                    width   : '160px',
                    padding : '5px 25px 5px 10px'
                }
            }
        ];

        const items = [];

        list.forEach((item) => {    /* eslint-disable-line max-lines-per-function */
            const tableItem = {
                id         : item.id,
                isArchived : item.isArchived,
                fields     : [
                    {
                        componentType : 'text',
                        component     : (
                            <div className={styles.readerWrapper}>
                                <CameraStatus
                                    className             = {styles.icon}
                                    type                  = {item?.status}
                                    lastSuccessStreamAt   = {item?.lastSuccessStreamAt}
                                    t                     = {t}
                                />
                            </div>
                        )
                    }, {
                        componentType : 'chip',
                        component     : item?.name
                            ? (
                                <Chip className={styles.chip} t={t}>
                                    {item?.name}
                                </Chip>
                            ) : EMPTY_TEXT
                    }, {
                        componentType : 'accessReadersGroups',
                        component     : item?.accessTokenReaders?.length
                            ? (
                                <ExpandedChipsList
                                    list = {[
                                        ...(item?.accessTokenReaders || [])?.sort((a, b) => {
                                            const firstLabel  = a?.name?.toLowerCase() || '';
                                            const secondLabel = b?.name?.toLowerCase() || '';

                                            return sortComparator(firstLabel, secondLabel, 'ASC');
                                        })
                                    ]
                                        ?.filter(entity => entity.name)
                                        ?.map(entity => ({
                                            id    : entity.id,
                                            key   : `${item.id}${entity.id}`,
                                            label : entity.name,
                                            item  : entity
                                        }))}
                                />
                            ) : EMPTY_TEXT
                    }, {
                        componentType : 'button',
                        component     : (
                            <Button
                                className  = {styles.previewControl}
                                onClick    = {handleOpenPreviewModal(item)}
                                size       = 'S'
                            >
                                {t('tables:Preview')}
                                <SvgIcon
                                    className = {styles.cameraIcon}
                                    type      = {'camera'}
                                    color     = {'white'}
                                />
                            </Button>
                        )
                    }, {
                        componentType : 'switch',
                        component     : (
                            <Tooltip title={item.enabled ? t('tables:Enabled') : t('tables:Disabled')}>
                                <div className={styles.switchWrapper}>
                                    <Switch
                                        name         = 'enabled'
                                        value        = {item.enabled}
                                        onChange     = {handleToggleEnabled(item.id)}
                                        isDisabled   = {!!item?.isArchived}
                                        isProcessing = {processingFields.includes(`enabled${item.id}`)}
                                        disabled     = {processingFields.includes(`selected${item.id}`) || item.isArchived}
                                    />
                                </div>
                            </Tooltip>
                        )
                    }, {
                        componentType : 'defaultActions',
                        component     : (
                            <DefaultActions
                                item            = {item}
                                handleRunAction = {handleRunAction}  // eslint-disable-line react/jsx-no-bind
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
                                    { getRelativeTime(item.updatedAt, { timezone }) || EMPTY_TEXT }
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
                                    {  getRelativeTime(item.createdAt, { timezone }) || EMPTY_TEXT }
                                </div>
                            </Tooltip>
                        )
                    }
                ]
            };

            items.push(tableItem);
        });

        return {
            columns : NODES_LIST_COLUMNS,
            items
        };
    }

    function handleChangeTab({ value }) {
        history.push(ROUTES.CAMERAS);

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
    const isNothingFound = search?.trim()?.length
        || [ true, false ].includes(enabled) || (updateStart && updateEnd)
        || (createStart && createEnd);

    return (
        <PageTable
            columns          = {columns}
            visibleColumns   = {visibleColumns}
            items            = {items}
            itemsCount       = {total}
            perPage          = {limit}
            isLoading        = {isLoading}
            currentPage      = {currentPage}
            emptyListMessage = {!isNothingFound
                ? (
                    <div>
                        {t('cameras-page:No cameras to display')} <br />
                        {t('cameras-page:You can add camera')}
                    </div>
                ) : t('tables:Nothing found')
            }
            isNothingFound = {!!isNothingFound}
            setVisibleColumns = {useCallback(setVisibleColumns, [])}
            onChangePage      = {useCallback(handleChangePage, [])}
            onChangeTab       = {useCallback(handleChangeTab, [])}
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
    list           : PropTypes.array,
    visibleColumns : PropTypes.array,
    filters        : PropTypes.shape({
        sortedBy   : PropTypes.string,
        order      : PropTypes.string,
        search     : PropTypes.string,
        isArchived : PropTypes.bool
    }).isRequired,
    limit             : PropTypes.number.isRequired,
    offset            : PropTypes.number.isRequired,
    isLoading         : PropTypes.bool.isRequired,
    total             : PropTypes.number.isRequired,
    openModal         : PropTypes.func.isRequired,
    updateItem        : PropTypes.func.isRequired,
    fetchItems        : PropTypes.func.isRequired,
    changeFilters     : PropTypes.func.isRequired,
    addToast          : PropTypes.func.isRequired,
    setVisibleColumns : PropTypes.func.isRequired,
    timezone          : PropTypes.string,
    t                 : PropTypes.func.isRequired,
    deleteItem        : PropTypes.func.isRequired,
    closeModal        : PropTypes.func.isRequired
};


Table.defaultProps = {
    list           : [],
    visibleColumns : [],
    timezone       : void 0
};

export default Table;

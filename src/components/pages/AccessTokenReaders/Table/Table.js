/* eslint-disable react/jsx-no-bind */
import React, {
    useState,
    useCallback,
    useMemo,
    useEffect
}                           from 'react';
import PropTypes            from 'prop-types';

import PageTable          from 'templater-ui/src/components/shared/PageTable';
import Button             from 'templater-ui/src/components/base/Button';
import Tooltip            from 'templater-ui/src/components/base/Tooltip';
import Switch             from 'templater-ui/src/components/base/Switch';
import Text               from 'templater-ui/src/components/base/Text';
import Chip               from 'templater-ui/src/components/base/Chip';
import IconButton         from 'templater-ui/src/components/base/IconButton';

import {
    getRelativeTime,
    formatDate
}                         from 'Utils/date';
import { sortComparator } from 'Utils/sort';
import { TOASTS_KEYS }    from 'Constants/toasts';
import * as ROUTES        from 'Constants/routes';
import history            from 'History';
import Status             from 'Shared/Status';
import DefaultActions     from 'Shared/PageTable/DefaultActions';
import ExpandedChipsList  from 'Shared/ExpandedChipsList';
import TopicStates        from 'Shared/TopicStates';
import SvgIcon            from 'Base/SvgIcon';

import styles             from './Table.less';

// const cx = classnames.bind(styles);

function Table(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        openModal, updateItem, changeFilters, filters,
        list, total, limit, offset, isLoading, fetchItems, addToast,
        doorStateByReaderCode, setDoorState, timezone, t,
        deleteItem, closeModal, setVisibleColumns, visibleColumns
    } = props;
    const {
        sortedBy, order, isArchived, search, accessReadersGroupIds,
        connectionStatus, enabled, updateStart, updateEnd, createStart, createEnd
    } = filters;
    const [ processingFields, setProcessingFields ] = useState([]);

    useEffect(() => () => handleChangePage(1), []);

    function showUpdateItemToast(isSuccess) {
        if (isSuccess) {
            addToast({
                key     : TOASTS_KEYS.accessTokenReaderUpdate,
                title   : t('Action was completed successfully'),
                message : t('readers-page:Access point has been updated'),
                type    : 'success'
            });
        } else {
            addToast({
                key     : TOASTS_KEYS.accessTokenReaderUpdate,
                title   : t('Something went wrong'),
                message : t('readers-page:Access point hasn\'t been updated'),
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
        openModal('accessTokenReader', {
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
            // showUpdateItemToast(true);
        } catch (error) {
            showUpdateItemToast(false);
        }
    }

    function handleToggleReader(doorStateData) {
        return () => {
            if (!doorStateData) return;
            const { topic, readerName, isDoorOpen } = doorStateData;

            setDoorState({
                topic,
                value   : !isDoorOpen,
                // onSuccess : () => addToast({
                //     key     : TOASTS_KEYS.accessTokenReaderDoorState,
                //     title   : t('Action was completed successfully'),
                //     message : (
                //         <div>
                //             {t('readers-page:Access point')}<b> { readerName } </b>{isDoorOpen ?
                //              t('readers-page:has been closed') : t('readers-page:has been opened')}
                //         </div>
                //     ),
                //     type : 'success'
                // }),
                onError : () => addToast({
                    key     : TOASTS_KEYS.accessTokenReaderDoorState,
                    title   : t('Something went wrong'),
                    message : (
                        <div >
                            {t('readers-page:Access point')}<b> { readerName } </b>{isDoorOpen ? t('readers-page:hasn\'t been closed') : t('readers-page:hasn\'t been opened')}
                        </div>
                    ),
                    type : 'error'
                })
            });
        };
    }

    async function archiveItem(itemId) {
        try {
            await withProcessing(
                updateItem({ id: itemId, isArchived: true }),
                `zip${itemId}`
            );
            await fetchItems(filters);
            // showUpdateItemToast(true);
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
            case 'settings':
                return handleOpenSettingsModal(item);
            case 'delete':
                return handleOpenDeleteModal(item);
            default:
                return null;
        }
    };

    function handleArchiveEntity(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('readers-page:Hide access point'),
            message      : t('readers-page:The access point will be automatically turned off after hiding.'),
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
            title        : t('readers-page:Delete access point'),
            message      : t('readers-page:The access point will be deleted. You cannot undo this action via web application.'),
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

    function handleOpenSettingsModal(item) {
        openModal('deviceSettings', {
            accessTokenReaderId : item?.id,
            entityId            : item?.code,
            entityName          : item?.name
        });
    }

    function handleOpenReadersGroupsSettings() {
        openModal('accessReadersGroups', {
            onClose : () => {
                refreshList();
            }
        });
    }

    function getTableData(list = []) {  // eslint-disable-line no-shadow, max-lines-per-function
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
                    width : '160px'
                }
            }, {
                name         : 'code',
                component    : t('Reader'),
                align        : 'left',
                sortable     : true,
                configurable : true,
                style        : {
                    width : '170px'
                }
            }, {
                name         : 'readersGroups',
                label        : t('Spaces'),
                configurable : true,
                component    : (
                    <div className={styles.readersGroupsWrapper}>
                        <div className={styles.label}>
                            {t('Spaces')}
                        </div>
                        <IconButton
                            disableRipple
                            className = {styles.icon}
                            onClick   = {useCallback(handleOpenReadersGroupsSettings, [])}
                        >
                            <SvgIcon
                                type      = 'settings'
                                color     = 'greyDark'
                            />
                        </IconButton>

                    </div>
                ),
                align    : 'left',
                sortable : false,
                style    : {
                    width   : '180px',
                    padding : '3px 10px'
                }
            }, {
                name      : 'phone',
                component : t('Dial number'),
                align     : 'left',
                sortable  : false,
                style     : {
                    width    : 'calc(100% - 1280px)',  // 1280px = 160+160+120+185+90+160+170+55+180
                    minWidth : '180px'
                }
            }, {
                name      : 'inputsStatus',
                component : '',
                align     : null,
                sortable  : false,
                style     : {
                    width   : '25px',
                    padding : '0 0 0 5px'
                }
            }, {
                name      : 'doorStatus',
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
        const PER_PAGE = 10;

        list.slice(0, PER_PAGE).forEach((item) => {  // eslint-disable-line  max-lines-per-function
            const doorStateData = doorStateByReaderCode[item?.code];

            const tableItem = {
                id         : item.id,
                isArchived : item.isArchived,
                fields     : [
                    {
                        componentType : 'text',
                        component     : (
                            <div className={styles.readerWrapper}>
                                <Status
                                    className  = {styles.icon}
                                    color      = {item?.connectionStatus?.color}
                                    title      = {
                                        <div>
                                            <div>{t('tables:Status')}: {t(`tables:${item?.connectionStatus?.title}`)}</div>
                                            <div>{t('tables:Last activity')}: {item?.activeAt ? formatDate({ date: item?.activeAt, format: 'DD.MM.YY HH:mm' }) : '-'}</div>
                                            <div>{t('tables:Sync status')}: {item?.hasUpdates ? t('tables:Sync required') : t('tables:Up to date')}</div>
                                        </div>
                                    }
                                />
                            </div>
                        )
                    }, {
                        componentType : 'chip',
                        component     : (
                            item?.name
                                ? (
                                    <Chip className={styles.chip} t={t}>
                                        {item?.name}
                                    </Chip>
                                ) : '-'
                        )
                    }, {
                        componentType : 'text',
                        component     : (
                            <div className={styles.readerWrapper}>
                                {item?.code
                                    ? (
                                        <Text
                                            className = {styles.label}
                                            maxLength = {13}
                                            text      = {item?.code}
                                            ariaLabel = 'Считыватель'
                                        />
                                    ) : '-'
                                }
                            </div>
                        )
                    }, {
                        componentType : 'accessReadersGroups',
                        component     : item.accessReadersGroups?.length
                            ? (
                                <ExpandedChipsList
                                    list={item?.accessReadersGroups?.sort((a, b) => {
                                        const firstLabel  = a?.name?.toLowerCase() || '';
                                        const secondLabel = b?.name?.toLowerCase() || '';

                                        return sortComparator(firstLabel, secondLabel, 'ASC');
                                    })?.map(entity => ({
                                        id         : entity.id,
                                        key        : `${item.id}${entity.id}`,
                                        label      : entity.name,
                                        background : entity.color,
                                        item       : entity
                                    }))}
                                />
                            ) : '—'
                    }, {
                        componentType : 'text',
                        component     : (
                            <div className={styles.readerWrapper}>
                                {item?.phone
                                    ? (
                                        <Text
                                            className = {styles.label}
                                            text      = {item?.phone}
                                            ariaLabel = 'Номер дозвона'
                                        />
                                    ) : '—'
                                }
                            </div>
                        )
                    }, {
                        componentType : 'button',
                        component     : (
                            <TopicStates
                                topics = {item?.displayedTopics?.filter(topic =>
                                    topic.split('/')[topic.split('/').length - 1][0] !== 's')} //  temporary solution until design is ready
                            />
                        )
                    }, {
                        componentType : 'button',
                        component     : (
                            <Button
                                className  = {styles.doorStatusControl}
                                isLoading  = {doorStateData?.isProcessing}
                                onClick    = {handleToggleReader(doorStateData, item)}
                                isDisabled = {!doorStateData}
                                size       = 'S'
                                color      = {doorStateData?.isDoorOpen ? 'red' : 'openButton'}
                            >
                                {doorStateData?.isDoorOpen ? t('Close') : t('Open')}
                                <SvgIcon
                                    type      = {doorStateData?.isDoorOpen ? 'lockOpened' : 'lock'}
                                    className = {styles.lockIcon}
                                    color     = 'white'
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
                                handleRunAction = {handleRunAction}
                                withSettings
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
        history.push(ROUTES.ACCESS_TOKEN_READERS);

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
        || connectionStatus || [ true, false ].includes(enabled) || (updateStart && updateEnd)
        || (createStart && createEnd) || accessReadersGroupIds?.length);

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
                        {t('readers-page:No access points to display')}<br />
                        {t('readers-page:You can create access point')}
                    </div>
                ) : t('tables:Nothing found')
            }
            isNothingFound    = {!!isNothingFound}
            setVisibleColumns = {useCallback(setVisibleColumns, [])}
            onChangePage      = {useCallback(handleChangePage, [])}
            onChangeTab       = {useCallback(handleChangeTab, [])}
            setSortParams     = {useCallback(changeFilters, [])}
            sortedBy       = {sortedBy}
            order          = {order}
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
        sortedBy              : PropTypes.string,
        order                 : PropTypes.string,
        search                : PropTypes.string,
        isArchived            : PropTypes.bool,
        accessReadersGroupIds : PropTypes.array
    }).isRequired,
    limit                 : PropTypes.number.isRequired,
    offset                : PropTypes.number.isRequired,
    isLoading             : PropTypes.bool.isRequired,
    total                 : PropTypes.number.isRequired,
    openModal             : PropTypes.func.isRequired,
    updateItem            : PropTypes.func.isRequired,
    fetchItems            : PropTypes.func.isRequired,
    changeFilters         : PropTypes.func.isRequired,
    addToast              : PropTypes.func.isRequired,
    setVisibleColumns     : PropTypes.func.isRequired,
    setDoorState          : PropTypes.func.isRequired,
    doorStateByReaderCode : PropTypes.shape({}).isRequired,
    timezone              : PropTypes.string,
    t                     : PropTypes.func.isRequired,
    deleteItem            : PropTypes.func.isRequired,
    closeModal            : PropTypes.func.isRequired
};


Table.defaultProps = {
    list           : [],
    visibleColumns : [],
    timezone       : void 0
};

export default Table;

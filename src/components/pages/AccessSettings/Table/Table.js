/* eslint-disable  react/jsx-indent, more/no-duplicated-chains */
import React, {
    useState,
    useCallback,
    useMemo,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';

import PageTable                from 'templater-ui/src/components/shared/PageTable';
import Tooltip                  from 'templater-ui/src/components/base/Tooltip';
import Switch                   from 'templater-ui/src/components/base/Switch';
import ChipSubject              from 'templater-ui/src/components/base/Chip/ChipSubject';

import {
    getRelativeTime,
    formatDate
}                               from 'Utils/date';
import {
    checkIsScheduleRepeated,
    getFormattedSchedule
}                               from 'Utils/schedules';
import { sortComparator }       from 'Utils/sort';
import { TOASTS_KEYS }          from 'Constants/toasts';
import * as ROUTES              from 'Constants/routes';
import history                  from 'History';
import ExpandedChipsList        from 'Shared/ExpandedChipsList';
import DefaultActions           from 'Shared/PageTable/DefaultActions';

import styles                   from './Table.less';

function Table(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        openModal, closeModal, updateItem, changeFilters, filters,
        list, total, limit, offset, isLoading, fetchItems, addToast,
        timezone, t, deleteItem, setVisibleColumns, visibleColumns
    } = props;

    const {
        sortedBy, order, isArchived, search, accessScheduleIds, accessReadersGroupIds,
        stateStatus, enabled, updateStart, updateEnd, createStart, createEnd, accessTokenReaderIds
    } = filters;
    const [ processingFields, setProcessingFields ] = useState([]);

    useEffect(() => () => handleChangePage(1), []);

    function showUpdateItemToast(isSuccess) {
        if (isSuccess) {
            addToast({
                key     : TOASTS_KEYS.accessSettingUpdate,
                title   : t('Action was completed successfully'),
                message : t('access-page:Access has been updated'),
                type    : 'success'
            });
        } else {
            addToast({
                key     : TOASTS_KEYS.accessSettingUpdate,
                title   : t('Something went wrong'),
                message : t('access-page:Access hasn\'t been updated'),
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

    function editItem(itemId) {
        openModal('accessSetting', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchItems();
            },
            entityId : itemId
        });
    }

    async function unzipItem(itemId, item) {
        try {
            await withProcessing(
                updateItem({ id: itemId, ...item, isArchived: false }),
                `zip${itemId}`
            );
            await fetchItems();
            // showUpdateItemToast(true);
        } catch (error) {
            showUpdateItemToast(false);
        }
    }

    async function archiveItem(itemId, item) {
        try {
            await withProcessing(
                updateItem({ id: itemId, ...item, isArchived: true }),
                `zip${itemId}`
            );
            await fetchItems();
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
            case 'delete':
                return handleOpenDeleteModal(item);
            default:
                return null;
        }
    };

    function handleArchiveEntity(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('access-page:Hide access'),
            message      : t('access-page:The access will be automatically turned off after hiding.'),
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
            title        : t('access-page:Delete access'),
            message      : t('access-page:The access will be deleted. You cannot undo this action via web application.'),
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

    function getTableData(list = []) {  // eslint-disable-line max-lines-per-function, no-shadow
        const items = [];

        const NODES_LIST_COLUMNS = [
            {
                name      : 'accessSubjects',
                component : t('Subject'),
                align     : 'left',
                style     : {
                    width   : '210px',
                    padding : '5px 5px 5px 25px'
                }
            },
            {
                name      : 'accessSchedules',
                component : t('access-page:Schedule'),
                align     : 'left',
                style     : {
                    width   : '162px',
                    padding : '3px 5px 3px 0'
                }
            },
            {
                name      : 'accessReadersGroups',
                component : t('access-page:Spaces and points'),
                align     : 'left',
                sortable  : false,
                style     : {
                    width   : '162px',
                    padding : '3px 5px'
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

        list.forEach((item) => {    /* eslint-disable-line max-lines-per-function */
            const tableItem = {
                id         : item.id,
                isArchived : item.isArchived,
                fields     : [
                    {
                        componentType : 'accessSubjects',
                        component     : item?.accessSubjects?.length
                            ? (
                                <ExpandedChipsList
                                    maxAmount = {2}
                                    list      = {item?.accessSubjects?.sort((a, b) => {
                                        const firstLabel  = a?.name?.toLowerCase() || '';
                                        const secondLabel = b?.name?.toLowerCase() || '';

                                        return sortComparator(firstLabel, secondLabel, 'ASC');
                                    })?.map(entity => ({
                                        id   : entity.id,
                                        key  : `${item.id}${entity.id}`,
                                        item : entity
                                    }))}
                                    renderCustomItem = {(chip, chipIndex) => { // eslint-disable-line react/jsx-no-bind
                                        return (
                                            <ChipSubject
                                                key           = {`${chip?.id}${chipIndex}`}
                                                className     = {styles.chipSubject}
                                                fullName      = {chip?.fullName || ''}
                                                avatarColor   = {chip?.avatarColor}
                                                name          = {chip?.name}
                                                t             = {t}
                                                avatar        = {chip?.avatar}
                                                isArchived    = {!!chip?.isArchived}
                                                renderTooltip = {() => {    // eslint-disable-line react/jsx-no-bind
                                                    const { accessSubjectTokens } = chip || {};

                                                    return (
                                                        <div>
                                                            {chip?.fullName}
                                                            { accessSubjectTokens && accessSubjectTokens?.length
                                                                ? <div style={{ marginTop: '5px' }}>{t('Tags')}: <br /></div>
                                                                : null
                                                            }
                                                            { accessSubjectTokens?.map(token => {
                                                                return <div key={`${chip?.id}${token?.id}`}>• {token?.name}<br /></div>;
                                                            })}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        );
                                    }}
                                    lessControlProps = {{
                                        variant   : 'outlined',
                                        size      : 'XL',
                                        className : styles.chipSubjectExpandControl
                                    }}
                                    moreControlProps = {{
                                        variant   : 'outlined',
                                        size      : 'XL',
                                        className : styles.chipSubjectExpandControl
                                    }}
                                />
                            ) : '—'
                    },
                    {
                        componentType : 'text',
                        component     : item.accessSchedules?.length
                            ? (
                                <ExpandedChipsList
                                    list             = {item?.accessSchedules?.sort((a, b) => {
                                        const firstLabel  = a?.name?.toLowerCase() || '';
                                        const secondLabel = b?.name?.toLowerCase() || '';

                                        return sortComparator(firstLabel, secondLabel, 'ASC');
                                    })?.map(entity => ({
                                        id          : entity.id,
                                        key         : `${item.id}${entity.id}`,
                                        item        : entity,
                                        label       : entity.name,
                                        size        : 'S',
                                        variant     : checkIsScheduleRepeated(entity) ? 'filled' : 'outlined',
                                        color       : 'accessSchedule',
                                        tooltipMode : 'always'
                                    }))}
                                    renderTooltip    = {(schedule) => { // eslint-disable-line react/jsx-no-bind
                                        return (
                                            <p key   = {schedule.id} className = {styles.tagTooltip}>
                                                {schedule.name} <br />
                                                {getFormattedSchedule(schedule, timezone)}
                                            </p>
                                        );
                                    }}
                                />
                            ) : '—'
                    }, {
                        componentType : 'accessReadersGroups',
                        component     : item?.accessReadersGroups?.length || item?.accessTokenReaders?.length
                            ? (
                                <ExpandedChipsList
                                    list = {[
                                        ...(item?.accessReadersGroups || [])?.sort((a, b) => {
                                            const firstLabel  = a?.name?.toLowerCase() || '';
                                            const secondLabel = b?.name?.toLowerCase() || '';

                                            return sortComparator(firstLabel, secondLabel, 'ASC');
                                        }),
                                        ...(item?.accessTokenReaders || [])?.sort((a, b) => {
                                            const firstLabel  = a?.name?.toLowerCase() || '';
                                            const secondLabel = b?.name?.toLowerCase() || '';

                                            return sortComparator(firstLabel, secondLabel, 'ASC');
                                        })
                                    ]
                                        ?.filter(entity => entity.name)
                                        ?.map(entity => ({
                                            id             : entity.id,
                                            key            : `${item.id}${entity.id}`,
                                            label          : entity.name,
                                            background     : entity.color || '',
                                            color          : entity.color ? '' : 'green',
                                            variant        : entity.color ? '' : 'outlined',
                                            item           : entity,
                                            tooltipMode    : entity.color && entity?.accessTokenReaders?.length ? 'always' : void 0,
                                            tooltipContent : entity.color && entity?.accessTokenReaders?.length
                                                ? (
                                                    <div className={styles.readerTooltipWrapper}>
                                                        <div>{entity?.name}</div>
                                                        <div style={{ marginTop: '5px' }}>{t('Access points')}: </div>
                                                        { entity?.accessTokenReaders?.map(reader => (
                                                            <div key={`${reader?.id}${entity.id}`}>• {reader?.name}</div>
                                                        )) }
                                                    </div>
                                                ) : void 0
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
                                // eslint-disable-next-line  react/jsx-no-bind
                                handleRunAction = {handleRunAction}
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
                                ariaLabel ='updated at date'
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
                                ariaLabel ='created at date'
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
        history.push(ROUTES.ACCESS_SETTINGS);

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
        || stateStatus || [ true, false ].includes(enabled) || (updateStart && updateEnd)
        || (createStart && createEnd) || accessScheduleIds?.length || accessReadersGroupIds?.length
        || accessTokenReaderIds?.length);

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
                        {t('access-page:There are no accesses to display')} <br />
                        {t('access-page:You can create access')}
                    </div>
                ) : t('tables:Nothing found')
            }
            isNothingFound    = {!!isNothingFound}
            setVisibleColumns = {useCallback(setVisibleColumns, [])}
            onChangePage      = {useCallback(handleChangePage, [])}
            onChangeTab       = {useCallback(handleChangeTab, [])}
            sortedBy          = {sortedBy}
            order             = {order}
            setSortParams     = {useCallback(changeFilters, [])}
            sortKey           = 'sortedBy'
            tabs              = {useMemo(() => ([ {
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
        status                : PropTypes.string,
        type                  : PropTypes.string,
        enabled               : PropTypes.bool,
        accessScheduleIds     : PropTypes.array,
        accessReadersGroupIds : PropTypes.array,
        accessTokenReaderIds  : PropTypes.array,
        createStart           : PropTypes.string,
        createEnd             : PropTypes.string,
        updateStart           : PropTypes.string,
        updateEnd             : PropTypes.string
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

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
import Typography               from 'templater-ui/src/components/base/Typography';

import {
    getRelativeTime,
    formatDate
}                               from 'Utils/date';
import { sortComparator }       from 'Utils/sort';
import { TOASTS_KEYS }          from 'Constants/toasts';
import * as ROUTES              from 'Constants/routes';
import history                  from 'History';
import ExpandedChipsList        from 'Shared/ExpandedChipsList';
import SvgIcon                  from 'Base/SvgIcon';
import DefaultActions           from 'Shared/PageTable/DefaultActions';
import { renderIcon }           from 'Shared/PageTable/DefaultActions/DefaultActions';
import DownloadCsvButton        from '../DownloadCsvButton';

import styles                   from './Table.less';

function Table(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        openModal, updateItem, changeFilters, filters,
        list, total, limit, offset, isLoading, fetchItems, addToast,
        timezone, t, deleteItem, closeModal, inviteItem,
        setVisibleColumns, visibleColumns
    } = props;
    const {
        sortedBy, order, isArchived, search, mobileEnabled,
        stateStatus, enabled, updateStart, updateEnd, createStart, createEnd
    } = filters;
    const [ processingFields, setProcessingFields ] = useState([]);

    useEffect(() => () => handleChangePage(1), []);

    function showUpdateItemToast(isSuccess) {
        if (isSuccess) {
            addToast({
                key     : TOASTS_KEYS.accessSubjectUpdate,
                title   : t('Action was completed successfully'),
                message : t('subjects-page:Subject has been updated'),
                type    : 'success'
            });
        } else {
            addToast({
                key     : TOASTS_KEYS.accessSubjectUpdate,
                title   : t('Something went wrong'),
                message : t('subjects-page:Subject hasn\'t been updated'),
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
        openModal('accessSubject', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchItems();
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
            await fetchItems();
            // showUpdateItemToast(true);
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
            case 'invite':
                return handleInviteSubject(item);
            default:
                return null;
        }
    };

    function handleArchiveEntity(item) {
        openModal('confirm', {
            size         : 'L',
            title        : t('subjects-page:Hide subject'),
            message      : t('subjects-page:The subject will be automatically turned off after hiding.'),
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
            title        : t('subjects-page:Delete subject'),
            message      : t('subjects-page:The subject will be deleted. You cannot undo this action via web application.'),
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

    async function handleInviteSubject(item) {
        if (item?.isInvited) {
            openModal('confirm', {
                size    : 'L',
                title   : t('Invite'),
                message : <div className={styles.modalContent}>
                    <Typography className={styles.title} variant='headline3'>{t('subjects-page:Resend the email?')}</Typography>
                    <Typography variant='caption1'><span className={styles.caption}>{t('subjects-page:The letter will be sent to the address specified earlier')}</span> {item?.email}</Typography>
                </div>,
                cancelLabel  : t('Cancel'),
                confirmLabel : t('Send'),
                controlColor : 'primary600',
                onSubmit     : async () => {
                    try {
                        await inviteItem({ id: item?.id });
                        await fetchItems();
                        closeModal('confirm');
                    } catch (error) {
                        console.error(error);
                    }
                },
                onCancell : () => closeModal('confirm')
            });
        } else {
            try {
                await inviteItem({ id: item?.id });
                await fetchItems();
            } catch (error) {
                console.error(error);
            }
        }
    }

    function getTableData(list = []) {  // eslint-disable-line max-lines-per-function, no-shadow
        const NODES_LIST_COLUMNS = [
            {
                name      : 'name',
                component : t('Name'),
                align     : 'left',
                sortable  : true,
                style     : {
                    width   : '200px',
                    padding : '5px 10px 5px 25px'
                }
            },
            {
                name      : 'accessSubjectTokens',
                component : (
                    <div>
                        <div className={styles.label}>
                            {t('Tag')}
                        </div>
                    </div>
                ),
                align    : 'left',
                sortable : false,
                style    : {
                    width    : 'calc(100% - 950px)',   // 950px = 200+150+90+185+165+160
                    minWidth : '190px',
                    padding  : '3px 10px'
                }
            }, {
                name      : 'mobileEnabled',
                component : (
                    <div className={styles.label}>
                        {t('subjects-page:Mobile access')}
                    </div>
                ),
                align    : 'right',
                sortable : false,
                style    : {
                    width   : '150px',
                    padding : '3px 10px'
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
                    minWidth : '165px'
                }
            }, {
                name         : 'createdAt',
                component    : t('tables:Created'),
                align        : 'right',
                sortable     : true,
                configurable : true,
                style        : {
                    minWidth : '160px',
                    padding  : '5px 25px 5px 10px'
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
                        componentType : 'avatar',
                        component     : (
                            <div className={styles.avatarChip}>
                                <ChipSubject
                                    fullName    = {item?.fullName}
                                    avatarColor = {item?.avatarColor}
                                    name        = {item?.name}
                                    avatar      = {item?.avatar}
                                    t           = {t}
                                />
                            </div>
                        )
                    }, {
                        componentType : 'accessSubjectToken',
                        component     : item.accessSubjectTokens?.length
                            ? (
                                <ExpandedChipsList
                                    list          = {item?.accessSubjectTokens?.sort((a, b) => {
                                        const firstLabel  = a?.name?.toLowerCase() || '';
                                        const secondLabel = b?.name?.toLowerCase() || '';

                                        return sortComparator(firstLabel, secondLabel, 'ASC');
                                    })?.map(entity => ({
                                        id      : entity.id,
                                        key     : `${item.id}${entity.id}`,
                                        label   : entity.name,
                                        color   : 'yellow',
                                        variant : 'outlined',
                                        item    : entity
                                    }))}
                                    renderTooltip = {(entity) => { // eslint-disable-line react/jsx-no-bind
                                        return (
                                            <p key = {entity.name} className = {styles.tagTooltip}>
                                                {entity.name}
                                            </p>
                                        );
                                    }}
                                />
                            ) : '—'
                    }, {
                        componentType : item?.mobileEnabled ? 'icon' : 'emptyText',
                        component     : (
                            item?.mobileEnabled
                                ? (
                                    <SvgIcon
                                        className = {styles.mobileEnabledIcon}
                                        type      = {'successGreen'}
                                    />
                                ) : '—'
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
                                handleRunAction = {handleRunAction}  // eslint-disable-line react/jsx-no-bind
                                customActions   = {
                                    item?.mobileEnabled && [ {
                                        label : t('Invite'),
                                        value : 'invite',
                                        icon  : renderIcon('mail')
                                    } ]
                                }
                                withInvite      = {item?.mobileEnabled}
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
        history.push(ROUTES.ACCESS_SUBJECTS);

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
        || stateStatus || [ true, false ].includes(enabled) || (updateStart && updateEnd)
        || [ true, false ].includes(mobileEnabled)
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
            renderControls   = {() => { // eslint-disable-line react/jsx-no-bind
                return <DownloadCsvButton t={t} />;
            }}
            emptyListMessage = {!isNothingFound
                ? (
                    <div>
                        {t('subjects-page:No subjects to display')}<br />
                        {t('subjects-page:You can create subject')}
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
    inviteItem        : PropTypes.func.isRequired,
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

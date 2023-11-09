/* eslint-disable more/no-duplicated-chains */
import React, {
    useCallback,
    useMemo,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';

import PageTable                from 'templater-ui/src/components/shared/PageTable';
import Tooltip                  from 'templater-ui/src/components/base/Tooltip';
import Chip                     from 'templater-ui/src/components/base/Chip';
import ChipSubject              from 'templater-ui/src/components/base/Chip/ChipSubject';

import {
    getRelativeTime,
    formatDate
}                               from 'Utils/date';
import * as ROUTES              from 'Constants/routes';
import history                  from 'History';
import SvgIcon                  from 'Base/SvgIcon';

import DownloadCsvButton        from '../DownloadCsvButton';
import styles                   from './Table.less';

const STATUS_TEXT_BY_STATUS_CODE = {
    DENIED    : 'Access denied',
    SUCCESS   : 'Success',
    ALARM_ON  : 'Alarm activated',
    ALARM_OFF : 'Alarm deactivated'
};

function Table(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        openModal, changeFilters, filters, timezone,
        list, total, limit, offset, isLoading, t
    } = props;
    const {
        sortedBy, order, search, accessTokenReaderIds, type, status, initiatorTypes,
        stateStatus, enabled, updateStart, updateEnd, createStart, createEnd
    } = filters;

    useEffect(() => () => handleChangePage(1), []);

    function getAccessToken(item) {
        if ([ 'ALARM_ON', 'ALARM_OFF' ].includes(item?.status)) {
            return (<Chip t={t} tooltipMode='never' className={styles.mobileIconChip}>
                <SvgIcon
                    className = {styles.securityAlarmIcon}
                    type      = 'securityAlarmLog'
                    color     = 'red'
                    size      = {16}
                    />
            </Chip>);
        }
        switch (item?.initiatorType) {
            case 'ACCESS_POINT':
                return <Chip t={t}>{item?.accessSubjectToken?.name}</Chip>;
            case 'SUBJECT':
                return <Chip t={t} tooltipMode='never' className={styles.mobileIconChip}>📱</Chip>;
            case 'PHONE':
                return <Chip t={t} tooltipMode='never' className={styles.mobileIconChip}>📞</Chip>;
            case 'BUTTON':
                return (<Chip t={t} tooltipMode='never' className={styles.mobileIconChip}>
                    <SvgIcon
                        className = {styles.exitButtonIcon}
                        type      = 'exitButton'
                        color     = 'black'
                        />
                </Chip>);
            default:
                return '—';
        }
    }

    function handleOpenViewModal({ mediaType, media }) {
        return () => {
            openModal('accessLogMedia', {
                mediaType,
                media
            });
        };
    }

    function getViewIcons({ recordedMedia } = {}) {
        const { videos, frames } = recordedMedia;

        return (
            <div className={styles.viewIcons}>
                {
                    videos?.length
                        ?
                            <SvgIcon
                                onClick = {handleOpenViewModal({ mediaType: 'videos', media: videos })}
                                type  = 'video'
                                color = 'transparent'
                            />
                        : null
                }
                {
                    frames?.length
                        ?
                            <SvgIcon
                                onClick = {handleOpenViewModal({ mediaType: 'frames', media: frames })}
                                type  = 'picture'
                                color = 'transparent'
                        />
                        : null
                }
            </div>
        );
    }

    function getTableData(list = []) {  // eslint-disable-line max-lines-per-function, no-shadow
        const NODES_LIST_COLUMNS = [
            {
                name      : 'subjectName',
                component : t('Subject'),
                align     : 'left',
                sortable  : true,
                style     : {
                    width   : '230px',
                    padding : '5px 10px 5px 25px'
                }
            },
            {
                name      : 'initiatorType',
                component : (
                    <div className={styles.accessSubjectToken}>
                        <div className={styles.label}>
                            {t('Tag')}
                        </div>
                    </div>
                ),
                align    : 'left',
                sortable : true,
                style    : {
                    width   : '200px',
                    padding : '3px 10px'
                }
            }, {
                name      : 'readerName',
                component : t('Access point'),
                align     : 'left',
                sortable  : true,
                style     : {
                    width       : '200px',
                    padding     : '5px 20px 5px 20px',
                    marginRight : 'auto'
                }
            }, {
                name      : 'view',
                component : '',
                align     : 'left',
                style     : {
                    width       : 'calc(100% - 962px)',    // 962 = 230+200+200+162+170
                    minWidth    : '200px',
                    padding     : '5px 20px 5px 20px',
                    marginRight : 'auto'
                }
            }, {
                name      : 'status',
                component : t('tables:Status'),
                align     : 'right',
                sortable  : true,
                style     : {
                    width   : '162px',
                    padding : '5px 5px 5px 5px'
                }
            }, {
                name      : 'attemptedAt',
                component : t('access-logs-page:Time'),
                align     : 'right',
                sortable  : true,
                style     : {
                    width   : '170px',
                    padding : '5px 25px 5px 10px'
                }
            }
        ];

        const items = [];

        list.forEach((item) => {
            const accessSubject = item?.accessSubject;

            const tableItem = {
                id         : item.id,
                className  : [ 'DENIED', 'ALARM_ON' ].includes(item.status) ? styles.errorTableRow : void 0,
                isArchived : item.isArchived,
                fields     : [
                    {
                        componentType : 'avatar',
                        component     : (
                            <div className={styles.avatarChip}>
                                { accessSubject
                                    ? (
                                        <ChipSubject
                                            fullName    = {accessSubject?.fullName}
                                            avatarColor = {accessSubject?.avatarColor || 'rgb(174, 224, 68)'}
                                            name        = {accessSubject?.name}
                                            avatar      = {accessSubject?.avatar}
                                            t           = {t}
                                        />
                                    ) : '—'
                                }
                            </div>
                        )
                    },
                    {
                        componentType : 'chip',
                        component     : (
                            getAccessToken(item)
                        )
                    }, {
                        componentType : 'chip',
                        component     : (
                            item?.accessTokenReader.name
                                ? <Chip t={t}>{item?.accessTokenReader.name}</Chip>
                                : '—'
                        )
                    }, {
                        componentType : 'icons',
                        component     : getViewIcons(item)
                    }, {
                        componentType : 'text',
                        component     : (
                            t(`access-logs-page:${STATUS_TEXT_BY_STATUS_CODE[item?.status]}`) || '—'
                        )
                    }, {
                        componentType : 'text',
                        component     : (
                            <Tooltip
                                title     = {formatDate({ date: item.attemptedAt, timezone })}
                                placement = 'bottom-end'
                                ariaLabel = 'created at date'
                            >
                                <div>
                                    { getRelativeTime(item.attemptedAt, { timezone }) || '—' }
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
        history.push(ROUTES.ACCESS_LOGS);

        switch (value) {
            case 'success':
                return changeFilters({ status: 'SUCCESS', offset: 0 });
            case 'denied':
                return changeFilters({ status: 'DENIED', offset: 0 });
            case 'all':
                return changeFilters({ status: void 0, offset: 0 });
            default:
                return null;
        }
    }

    function handleChangePage(page) {
        const offset = page > 0 ? (page - 1) * (filters?.limit || 1) : 0;   // eslint-disable-line no-shadow

        changeFilters({ offset });
    }
    const { columns, items } = getTableData(list);
    const currentPage = Math.floor(offset / limit) + 1;
    const isNothingFound = search?.trim()?.length
        || type || stateStatus || [ true, false ].includes(enabled)
        || initiatorTypes?.length || (updateStart && updateEnd)
        || (createStart && createEnd) || accessTokenReaderIds?.length;

    return (
        <PageTable
            columns          = {columns}
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
                        {t('tables:No data to display')} <br />
                        {t('tables:Access log is empty')}
                    </div>
                ) : t('tables:Nothing found')
            }
            isNothingFound = {!!isNothingFound}
            onChangePage   = {useCallback(handleChangePage, [])}
            onChangeTab    = {useCallback(handleChangeTab, [])}
            sortedBy         = {sortedBy}
            order          = {order}
            setSortParams  = {useCallback(changeFilters, [])}
            sortKey        = 'sortedBy'
            tabs           = {useMemo(() => ([ {
                label    : t('tables:All'),
                value    : 'all',
                isActive : status !== false && !status
            },  {
                label    : t('access-logs-page:Access denied'),
                value    : 'denied',
                isActive : status === 'DENIED'
            },
            {
                label    : t('access-logs-page:Success'),
                value    : 'success',
                isActive : status === 'SUCCESS'
            }   ]), [ status ])}
            tabsMode = 'outside'
        />
    );
}

Table.propTypes = {
    list    : PropTypes.array,
    filters : PropTypes.shape({
        initiatorTypes       : PropTypes.array,
        status               : PropTypes.oneOf([ 'SUCCESS', 'DENIED', '' ]),
        sortedBy             : PropTypes.string,
        order                : PropTypes.string,
        search               : PropTypes.string,
        accessTokenReaderIds : PropTypes.array
    }).isRequired,
    limit         : PropTypes.number.isRequired,
    offset        : PropTypes.number.isRequired,
    isLoading     : PropTypes.bool.isRequired,
    timezone      : PropTypes.string,
    total         : PropTypes.number.isRequired,
    changeFilters : PropTypes.func.isRequired,
    openModal     : PropTypes.func.isRequired,
    t             : PropTypes.func.isRequired
};


Table.defaultProps = {
    list     : [],
    timezone : void 0
};

export default Table;

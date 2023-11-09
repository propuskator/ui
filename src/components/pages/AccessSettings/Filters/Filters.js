/* eslint-disable  babel/no-unused-expressions */
import React                    from 'react';
import PropTypes                from 'prop-types';

import Chip                     from 'templater-ui/src/components/base/Chip';
import SelectedChipValue        from 'templater-ui/src/components/base/Dropdown/SeleectedChipValue';

import { STATUSSES_LIST }       from 'Constants/filters';
import {
    checkIsScheduleRepeated
}                               from 'Utils/schedules';
import PageFilters              from 'Shared/PageFilters';


import styles                   from './Filters.less';


function Filters(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        filters, onChangeFilters, t,
        fetchAccessSchedules, fetchAccessReadersGroups, fetchAccessTokenReaders,
        visibleColumns
    } = props;
    const {
        accessScheduleIds, createStart, createEnd, updateStart,
        updateEnd, enabled, type, readersIds
    } = filters;

    // bad hack для изменения фильтра по пространствам и точкам - не поулчилось по другому

    function refreshAccessReadersGroups(params = {}) {
        return fetchAccessReadersGroups(params);
    }

    function refreshAccessSchedulesList(params = {}) {
        return fetchAccessSchedules(params);
    }

    function refreshAccessTokenReadersList(params = {}) {
        return fetchAccessTokenReaders(params);
    }

    function divideReadersByTypes(ids) {
        if (!ids) return { groupsIds: [],  tokensIds: [] };

        const groupsIds = [];
        const tokensIds = [];

        ids?.forEach(readerKey => {
            const keys = readerKey?.split(':');

            if (keys?.length !== 2) return; // eslint-disable-line  no-magic-numbers
            const [ id, tokenType ] = keys;

            if (tokenType === 'group') groupsIds.push(id);
            else if (tokenType === 'reader') tokensIds.push(id);
        });

        return { groupsIds, tokensIds };
    }

    function handleChangeFilters(filtersToSet) {
        const { editDate, createDate, readersIds, ...rest } = filtersToSet;  // eslint-disable-line no-shadow, max-len
        const processFilters = { ...rest };

        if (editDate) {
            processFilters.updateStart = editDate[0];
            processFilters.updateEnd   = editDate[1];
        }
        if (createDate) {
            processFilters.createStart = createDate[0];
            processFilters.createEnd   = createDate[1];
        }

        if (readersIds) {
            if (!readersIds?.length) {
                processFilters.accessReadersGroupIds = [];
                processFilters.accessTokenReaderIds = [];
            } else {
                const { groupsIds, tokensIds } = divideReadersByTypes(readersIds);

                processFilters.accessReadersGroupIds = groupsIds;
                processFilters.accessTokenReaderIds  = tokensIds;
            }

            processFilters.readersIds = readersIds;
        }

        onChangeFilters(processFilters);
    }

    function renderSelectChipValue(selected) {
        return (
            <div className={styles.selectedChipValue}>
                <SelectedChipValue list={selected.map(entity => entity.item)} />
            </div>
        );
    }

    function renderSelectedReaderValue(selected) {
        return (
            <div className={styles.selectedChipValue}>
                <SelectedChipValue
                    list={selected.map(entity => {
                        const { item = {} } = entity || {};

                        return ({
                            ...item,
                            variant : item?.isGroup ? void 0 : 'outlined',
                            color   : item?.isGroup ?  item?.color : 'green'
                        });
                    })} />
            </div>
        );
    }

    return (
        <PageFilters
            className      = {styles.Filters}
            searchLabel    = {t('access-page:Find by subject')}
            filters        = {filters}
            visibleColumns = {visibleColumns}
            changeFilters  = {handleChangeFilters}
            configuration  = {{  // eslint-disable-line max-lines-per-function
                name   : 'accessSubjectsFilters',
                fields : [
                    {
                        name      : 'accessScheduleIds',
                        type      : 'asyncDropdown',
                        label     : t('filters:By schedule'),
                        className : styles.multipleSelect,
                        default   : '',
                        props     : {
                            refreshList     : refreshAccessSchedulesList,
                            getMappedOption : (item) => {
                                return ({
                                    value : item?.id,
                                    label : item?.name,
                                    item  : {
                                        ...item,
                                        color   : 'accessSchedule',
                                        variant : checkIsScheduleRepeated(item) ? 'filled' : 'outlined'
                                    }
                                });
                            },
                            multiple     : true,
                            withSearch   : true,
                            renderOption : (item) => (
                                <Chip
                                    color   = {item?.color}
                                    variant = {item?.variant}
                                    t       = {t}
                                >
                                    {item.name}
                                </Chip>
                            ),
                            renderValue : renderSelectChipValue
                        }
                    },
                    {
                        name      : 'readersIds',
                        type      : 'asyncDropdown',
                        label     : t('filters:By spaces and points'),
                        className : styles.readersSelect,
                        props     : {
                            sortOptions : (options = []) => {
                                return [ ...options ]?.sort(option => option?.item?.isGroup ? -1 : 1) || [];   // eslint-disable-line  no-magic-numbers, max-len
                            },
                            refreshList : async (params) => {
                                try {
                                    const { groupsIds, tokensIds } = divideReadersByTypes(params?.ids);
                                    const promises = [
                                        refreshAccessReadersGroups({ ...(params || {}), ids: groupsIds }),
                                        refreshAccessTokenReadersList({ ...(params || {}), ids: tokensIds })
                                    ];
                                    const [ readersGroups = {}, tokenReaders = {} ] = await Promise.all(promises);

                                    const result = {
                                        meta : {
                                            filteredCount : readersGroups?.meta?.filteredCount
                                                + tokenReaders?.meta?.filteredCount
                                        },
                                        data : [
                                            ...(readersGroups?.data || [])
                                                ?.map(item => ({ ...(item || {}), value: `${item?.id}:group` })),
                                            ...(tokenReaders?.data || [])
                                                ?.map(item => ({ ...(item || {}), value: `${item?.id}:reader` }))
                                        ]
                                    };

                                    return result;
                                } catch (error) {
                                    console.error({ error });
                                }
                            },
                            getMappedOption : (item) => {
                                const isGroup = item?.color;

                                return ({
                                    value : `${item?.id}:${isGroup ? 'group' : 'reader'}`,
                                    label : item?.name,
                                    color : isGroup ? item.color : void 0,
                                    item  : {
                                        ...item,
                                        color      : isGroup ? item?.color : void 0,
                                        background : isGroup ? item?.color : void 0,
                                        name       : item?.name,
                                        isGroup
                                    }
                                });
                            },
                            multiple     : true,
                            withSearch   : true,
                            renderOption : (item) => {
                                const { isGroup } = item;

                                if (!isGroup) {
                                    return (
                                        <Chip color={'green'} variant={'outlined'} t={t}>
                                            {item.name}
                                        </Chip>
                                    );
                                }

                                return (
                                    <Chip background = {item.color} t={t}>
                                        {item.name}
                                    </Chip>
                                );
                            },
                            renderValue : renderSelectedReaderValue
                        }
                    },
                    {
                        name      : 'enabled',
                        type      : 'dropdown',
                        label     : t('filters:By status'),
                        className : styles.statusFilter,
                        default   : '',
                        props     : {
                            options      : STATUSSES_LIST.map((item) => ({ ...item, label: t(`filters:${item?.label}`) })),
                            withKeyboard : false
                        }
                    },
                    {
                        name          : 'editDate',
                        type          : 'dateRange',
                        dependentCols : [ 'updatedAt' ],
                        label         : t('filters:By editing date'),
                        className     : styles.editDate,
                        default       : [ filters.updateStart, filters.updateEnd ]
                    }, {
                        name          : 'createDate',
                        type          : 'dateRange',
                        dependentCols : [ 'createdAt' ],
                        label         : t('filters:By creation date'),
                        className     : styles.createDate,
                        default       : [ filters.createStart, filters.createEnd ]
                    }
                ]
            }}
            defaultExpanded={(
                !!(type || (createStart && createEnd) || (updateStart && updateEnd)
                || accessScheduleIds?.length || enabled || readersIds?.length)
            )}
        />
    );
}

Filters.propTypes = {
    visibleColumns : PropTypes.arrayOf(PropTypes.string).isRequired,
    filters        : PropTypes.shape({
        status                : PropTypes.string,
        type                  : PropTypes.string,
        enabled               : PropTypes.bool,
        createStart           : PropTypes.string,
        createEnd             : PropTypes.string,
        updateStart           : PropTypes.string,
        updateEnd             : PropTypes.string,
        accessScheduleIds     : PropTypes.array,
        accessReadersGroupIds : PropTypes.array
    }).isRequired,
    onChangeFilters          : PropTypes.func.isRequired,
    fetchAccessReadersGroups : PropTypes.func.isRequired,
    fetchAccessTokenReaders  : PropTypes.func.isRequired,
    fetchAccessSchedules     : PropTypes.func.isRequired,
    t                        : PropTypes.func.isRequired
};

export default Filters;

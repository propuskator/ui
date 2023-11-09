import React, {
    useCallback,
    useMemo
}                               from 'react';
import PropTypes                from 'prop-types';

import Chip                     from 'templater-ui/src/components/base/Chip';
import SelectedChipValue        from 'templater-ui/src/components/base/Dropdown/SeleectedChipValue';

import { STATUSSES_LIST }       from 'Constants/filters';
import PageFilters              from 'Shared/PageFilters';
import SvgIcon                  from 'Base/SvgIcon';

import styles                   from './Filters.less';


const CONNECTION_STATUSSES_LIST = [ {
    label : 'Active',
    value : 'Active',
    icon  : <SvgIcon type='status' color='green' />
}, {
    label : 'Init',
    value : 'Init',
    icon  : <SvgIcon type='status' color='yellow' />
}, {
    label : 'Connection problem',
    value : 'Connection problem',
    icon  : <SvgIcon type='status' color='yellow' />
}, {
    label : 'Sleeping',
    value : 'Sleeping',
    icon  : <SvgIcon type = 'status' color='yellow' />
}, {
    label : 'Inactive',
    value : 'Inactive',
    icon  : <SvgIcon type = 'status' color='red' />
} ];

function Filters(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        filters, onChangeFilters, fetchAccessReadersGroups, t,
        visibleColumns
    } = props;
    const {
        connectionStatus, createStart, createEnd, updateStart,
        updateEnd, enabled, accessReadersGroupIds
    } = filters;

    function refreshAccessReadersGroups(params) {
        return fetchAccessReadersGroups(params);
    }

    function handleChangeFilters(filtersToSet) {
        const { editDate, createDate, ...rest } = filtersToSet;
        const processFilters = { ...rest };

        if (editDate) {
            processFilters.updateStart = editDate[0];
            processFilters.updateEnd   = editDate[1];
        }
        if (createDate) {
            processFilters.createStart = createDate[0];
            processFilters.createEnd   = createDate[1];
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

    return (
        <PageFilters
            className      = {styles.Filters}
            searchLabel    = {t('readers-page:Find by reader or name')}
            filters        = {filters}
            visibleColumns = {visibleColumns}
            changeFilters  = {useCallback(handleChangeFilters, [])}
            configuration  = {useMemo(() => ({
                name   : 'pontsFilters',
                fields : [
                    {
                        name      : 'connectionStatus',
                        type      : 'dropdown',
                        label     : t('filters:By state'),
                        className : styles.typeFilter,
                        default   : '',
                        props     : {
                            options      : CONNECTION_STATUSSES_LIST.map((item) => ({ ...item, label: t(`tables:${item?.label}`) })),
                            withKeyboard : false
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
                        name          : 'accessReadersGroupIds',
                        dependentCols : [ 'readersGroups' ],
                        type          : 'asyncDropdown',
                        label         : t('filters:By spaces'),
                        className     : styles.accessReadersGroupFilter,
                        props         : {
                            refreshList     : refreshAccessReadersGroups,
                            getMappedOption : (item) => {
                                return ({
                                    value : item.id,
                                    label : item.name,
                                    color : item.color,
                                    item
                                });
                            },
                            multiple     : true,
                            withSearch   : true,
                            renderOption : (item) =>  (
                                <Chip background={item.color} t={t}>
                                    {item.name}
                                </Chip>
                            ),
                            renderValue : renderSelectChipValue
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
            }), [ filters ])}
            defaultExpanded={useMemo(() => (
                !!(connectionStatus || createStart || createEnd
                    || updateStart || updateEnd || enabled || (accessReadersGroupIds?.length))
            ), [])}
        />
    );
}

Filters.propTypes = {
    filters : PropTypes.shape({
        connectionStatus      : PropTypes.string,
        enabled               : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        updateStart           : PropTypes.string,
        updateEnd             : PropTypes.string,
        createStart           : PropTypes.string,
        createEnd             : PropTypes.string,
        accessReadersGroupIds : PropTypes.array
    }).isRequired,
    visibleColumns           : PropTypes.arrayOf(PropTypes.string).isRequired,
    onChangeFilters          : PropTypes.func.isRequired,
    fetchAccessReadersGroups : PropTypes.func.isRequired,
    t                        : PropTypes.func.isRequired
};

export default Filters;

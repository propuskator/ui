import React, {
    useCallback,
    useMemo
}                               from 'react';
import PropTypes                from 'prop-types';

import {
    STATUSSES_LIST
}                               from 'Constants/filters';
import PageFilters              from 'Shared/PageFilters';
import SvgIcon                  from 'Base/SvgIcon';

import styles                   from './Filters.less';

const STATE_STATUSSES_LIST = [ {
    label : 'Ready',
    value : 'ready',
    icon  : <SvgIcon type='status' color='green' />
}, {
    label : 'Init',
    value : 'init',
    icon  : <SvgIcon type='status' color='yellow' />
}, {
    label : 'Disconnected',
    value : 'disconnected',
    icon  : <SvgIcon type = 'status' color='red' />
} ];

function Filters(props) {    /* eslint-disable-line max-lines-per-function */
    const { filters, onChangeFilters, visibleColumns, t } = props;
    const { createStart, createEnd, updateStart, updateEnd, enabled } = filters;

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

    return (
        <PageFilters
            className      = {styles.Filters}
            searchLabel    = {t('cameras-page:Find by name')}
            filters        = {filters}
            visibleColumns = {visibleColumns}
            changeFilters  = {useCallback(handleChangeFilters, [])}
            configuration  = {useMemo(() => ({
                name   : 'pontsFilters',
                fields : [
                    {
                        name      : 'status',
                        type      : 'dropdown',
                        label     : t('filters:By state'),
                        className : styles.typeFilter,
                        default   : '',
                        props     : {
                            options      : STATE_STATUSSES_LIST.map((item) => ({ ...item, label: item?.label })),
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
                !!(createStart || createEnd
                    || updateStart || updateEnd || enabled)
            ), [])}
        />
    );
}

Filters.propTypes = {
    filters : PropTypes.shape({
        enabled     : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        updateStart : PropTypes.string,
        updateEnd   : PropTypes.string,
        createStart : PropTypes.string,
        createEnd   : PropTypes.string
    }).isRequired,
    visibleColumns  : PropTypes.func.isRequired,
    onChangeFilters : PropTypes.func.isRequired,
    t               : PropTypes.func.isRequired
};

export default Filters;

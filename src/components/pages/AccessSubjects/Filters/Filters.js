import React, {
    useCallback,
    useMemo
}                               from 'react';
import PropTypes                from 'prop-types';

import { STATUSSES_LIST }       from 'Constants/filters';
import PageFilters              from 'Shared/PageFilters';

import styles                   from './Filters.less';


export const MOBILE_ENABLED_LIST = [ {
    label : 'Allowed',
    value : true
}, {
    label : 'Not allowed',
    value : false
} ];

function Filters(props) {    /* eslint-disable-line max-lines-per-function */
    const { filters, onChangeFilters, visibleColumns, t } = props;
    const { stateStatus, createStart, createEnd, updateStart, updateEnd, enabled, mobileEnabled } = filters;

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
            searchLabel    = {t('subjects-page:Find by subject or tag')}
            filters        = {filters}
            visibleColumns = {visibleColumns}
            changeFilters  = {useCallback(handleChangeFilters, [])}
            configuration  = {useMemo(() => ({
                name   : 'pontsFilters',
                fields : [
                    {
                        name      : 'mobileEnabled',
                        type      : 'dropdown',
                        label     : t('subjects-page:Access from mobile device'),
                        className : styles.mobileEnabled,
                        default   : '',
                        props     : {
                            options      : MOBILE_ENABLED_LIST.map((item) => ({ ...item, label: t(`filters:${item?.label}`) })),
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
                !!(stateStatus || createStart || createEnd || mobileEnabled
                    || updateStart || updateEnd || enabled)
            ), [])}
        />
    );
}

Filters.propTypes = {
    filters : PropTypes.shape({
        stateStatus   : PropTypes.string,
        mobileEnabled : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        enabled       : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        updateStart   : PropTypes.string,
        updateEnd     : PropTypes.string,
        createStart   : PropTypes.string,
        createEnd     : PropTypes.string
    }).isRequired,
    onChangeFilters : PropTypes.func.isRequired,
    visibleColumns  : PropTypes.array.isRequired,
    t               : PropTypes.func.isRequired
};

export default Filters;

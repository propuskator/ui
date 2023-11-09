import React, {
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';

import PageFilters              from 'Shared/PageFilters';

import styles                   from './Filters.less';

export const INITIATOR_TYPES_LIST = [ {
    label : 'Сall',
    value : 'PHONE'
}, {
    label : 'Mobile',
    value : 'SUBJECT'
}, {
    label : 'Tag',
    value : 'ACCESS_POINT'
}, {
    label : 'Exit button',
    value : 'BUTTON'
}, {
    label : 'Alarm',
    value : 'ALARM'
} ];

function Filters(props) {
    const { filters,
        onChangeFilters,
        fetchAccessTokenReaders, t } = props;

    const {
        initiatorTypes, enabled, createStart, createEnd, accessTokenReaderIds
    } = filters;

    function handleChangeFilters(filtersToSet) {
        const { createDate, ...rest } = filtersToSet;
        const processFilters = { ...rest };

        if (createDate) {
            processFilters.createStart = createDate[0];
            processFilters.createEnd   = createDate[1];
        }

        onChangeFilters(processFilters);
    }

    return (
        <PageFilters
            className      = {styles.Filters}
            searchLabel    = {t('access-logs-page:Find by subject or tag')}
            filters        = {filters}
            changeFilters  = {useCallback(handleChangeFilters, [])}
            configuration  = {useMemo(() => ({
                name   : 'logsFilters',
                fields : [
                    {
                        name      : 'initiatorTypes',
                        type      : 'dropdown',
                        label     : t('filters:By tag'),
                        className : styles.typeFilter,
                        props     : {
                            options      : INITIATOR_TYPES_LIST.map((item) => ({ ...item, label: t(`filters:${item?.label}`) })),
                            multiple     : true,
                            withKeyboard : false
                        }
                    },
                    {
                        name      : 'accessTokenReaderIds',
                        type      : 'asyncDropdown',
                        label     : t('filters:By access point'),
                        className : styles.accessPoints,
                        props     : {
                            getMappedOption : (item) => {
                                return ({
                                    value : item.id,
                                    label : item.name,
                                    color : item.color,
                                    item
                                });
                            },
                            refreshList : fetchAccessTokenReaders,
                            multiple    : true,
                            withSearch  : true
                        }
                    },
                    {
                        name      : 'createDate',
                        type      : 'dateRange',
                        label     : t('filters:By time'),
                        className : styles.createDate,
                        default   : [ filters.createStart, filters.createEnd ]
                    }
                ]
            }), [ filters ])}
            defaultExpanded={useMemo(() => (
                !!(initiatorTypes?.length || createStart || createEnd || enabled || accessTokenReaderIds?.length)
            ), [])}
        />
    );
}

Filters.propTypes = {
    filters : PropTypes.shape({
        limit                : PropTypes.number,
        offset               : PropTypes.number,
        sortedBy             : PropTypes.string,
        status               : PropTypes.string,
        search               : PropTypes.string,
        type                 : PropTypes.string,
        initiatorTypes       : PropTypes.arrayOf(PropTypes.oneOf([ 'PHONE', 'SUBJECT', 'ACCESS_POINT',  'BUTTON', 'ALARM' ])),
        enabled              : PropTypes.bool,
        createStart          : PropTypes.string,
        createEnd            : PropTypes.string,
        isArchived           : PropTypes.bool,
        accessTokenReaderIds : PropTypes.array,
        accessSubjectId      : PropTypes.string,
        accessSubjectTokenId : PropTypes.string,
        order                : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    onChangeFilters         : PropTypes.func.isRequired,
    fetchAccessTokenReaders : PropTypes.func.isRequired,
    t                       : PropTypes.func.isRequired
};

export default Filters;

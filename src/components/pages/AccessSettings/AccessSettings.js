import React, {
    useCallback,
    useEffect,
    useState
}                               from 'react';
import classnames               from 'classnames/bind';
import PropTypes                from 'prop-types';

import PageStub                 from 'templater-ui/src/components/pages/PageStub';
import { getData }              from 'templater-ui/src/utils/helpers/localStorage';
import { TABLE_COLUMNS_KEY }    from 'Constants/localStorage';

import PageHeading              from 'Shared/PageHeading';

import pageStyles               from '../styles.less';
import Table                    from './Table';
import Filters                  from './Filters';

import styles                   from './AccessSettings.less';

const cx = classnames.bind(styles);

function AccessSettings(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        amount, total, isFetching, filters, changeFilters, t,
        fetchAccessSettings, list, openModal, refreshKey, timezone,
        setVisibleColumns, visibleColumns
    } = props;
    const {
        limit, offset, sortedBy, status, search, enabled, updateEnd,
        createStart, createEnd, isArchived, order, updateStart,
        accessReadersGroupIds, accessScheduleIds, accessTokenReaderIds
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        const { accessSettings } = getData(TABLE_COLUMNS_KEY) || {};

        if (Array.isArray(accessSettings)) setVisibleColumns(accessSettings);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAccessSettings();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order,
        accessScheduleIds, accessReadersGroupIds, accessTokenReaderIds,
        enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenCreateModal() {
        openModal('accessSetting', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchAccessSettings();
            },
            isCreateEntity : true
        });
    }

    return (
        <div className={cx(styles.AccessSettings)}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    className     = {pageStyles.pageHeading}
                    title         = {t('access-page:Accesses')}
                    buttonTitle   = {t('access-page:Create access')}
                    onButtonClick = {useCallback(handleOpenCreateModal, [])}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('access-page:No accesses to display')} <br /> {t('access-page:You can create access')}</>}
                >
                    <Filters
                        filters          = {filters}
                        visibleColumns   = {visibleColumns}
                        onChangeFilters  = {changeFilters}
                        t                = {t}
                    />

                    <div className={pageStyles.tableWrapper}>
                        <Table
                            list              = {isInitialized ? list : []}
                            visibleColumns    = {visibleColumns}
                            total             = {amount}
                            offset            = {offset}
                            limit             = {limit}
                            isLoading         = {isFetching}
                            changeFilters     = {changeFilters}
                            setVisibleColumns = {setVisibleColumns}
                            filters           = {filters}
                            timezone          = {timezone}
                            t                 = {t}
                        />
                    </div>
                </PageStub>
            </div>
        </div>
    );
}

AccessSettings.propTypes = {
    list           : PropTypes.array.isRequired,
    visibleColumns : PropTypes.array.isRequired,
    amount         : PropTypes.number.isRequired,
    total          : PropTypes.number.isRequired,
    isFetching     : PropTypes.bool.isRequired,
    filters        : PropTypes.shape({
        limit                 : PropTypes.number,
        offset                : PropTypes.number,
        sortedBy              : PropTypes.string,
        status                : PropTypes.string,
        search                : PropTypes.string,
        type                  : PropTypes.string,
        enabled               : PropTypes.bool,
        createStart           : PropTypes.string,
        createEnd             : PropTypes.string,
        updateStart           : PropTypes.string,
        updateEnd             : PropTypes.string,
        isArchived            : PropTypes.bool,
        accessScheduleIds     : PropTypes.array,
        accessReadersGroupIds : PropTypes.array,
        accessTokenReaderIds  : PropTypes.array,
        order                 : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    changeFilters       : PropTypes.func.isRequired,
    setVisibleColumns   : PropTypes.func.isRequired,
    openModal           : PropTypes.func.isRequired,
    fetchAccessSettings : PropTypes.func.isRequired,
    refreshKey          : PropTypes.string.isRequired,
    timezone            : PropTypes.string,
    t                   : PropTypes.func.isRequired
};

AccessSettings.defaultProps = {
    timezone : void 0
};

export default AccessSettings;

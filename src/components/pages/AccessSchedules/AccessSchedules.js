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
import Filters                  from './Filters';
import Table                    from './Table';
import styles                   from './AccessSchedules.less';

const cx = classnames.bind(styles);

function AccessSchedules(props) {
    const {
        amount, total, isFetching, filters, changeFilters,
        fetchAccessSchedules, list, openModal, refreshKey, timezone,
        setVisibleColumns, visibleColumns, t
    } = props;
    const {
        limit, offset, sortedBy, status, search, type, enabled, periodicity,
        updateStart, updateEnd, createStart, createEnd, isArchived, order
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        const { accessSchedules } = getData(TABLE_COLUMNS_KEY) || {};

        if (Array.isArray(accessSchedules)) setVisibleColumns(accessSchedules);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAccessSchedules();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order, periodicity,
        type, enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenСreateTimeModal() {
        openModal('accessSchedule', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchAccessSchedules();
            },
            isCreateEntity : true
        });
    }

    return (
        <div className={styles.AccessSchedules}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    className     = {cx(pageStyles.pageHeading, styles.pageHeading)}
                    title         = {t('Schedules')}
                    buttonTitle   = {t('schedules-page:Create schedule')}
                    onButtonClick = {useCallback(handleOpenСreateTimeModal, [])}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('schedules-page:No schedules to display')} <br />{t('schedules-page:You can create schedule')}</>}
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

AccessSchedules.propTypes = {
    list           : PropTypes.array.isRequired,
    visibleColumns : PropTypes.array.isRequired,
    amount         : PropTypes.number.isRequired,
    total          : PropTypes.number.isRequired,
    isFetching     : PropTypes.bool.isRequired,
    filters        : PropTypes.shape({
        limit       : PropTypes.number,
        offset      : PropTypes.number,
        sortedBy    : PropTypes.string,
        status      : PropTypes.string,
        search      : PropTypes.string,
        type        : PropTypes.string,
        enabled     : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        updateStart : PropTypes.string,
        updateEnd   : PropTypes.string,
        createStart : PropTypes.string,
        createEnd   : PropTypes.string,
        isArchived  : PropTypes.bool,
        periodicity : PropTypes.oneOf([ 'PERIODIC', 'NOT_PERIODIC', '' ]),
        order       : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    changeFilters        : PropTypes.func.isRequired,
    setVisibleColumns    : PropTypes.func.isRequired,
    fetchAccessSchedules : PropTypes.func.isRequired,
    openModal            : PropTypes.func.isRequired,
    refreshKey           : PropTypes.string.isRequired,
    timezone             : PropTypes.string,
    t                    : PropTypes.func.isRequired
};

AccessSchedules.defaultProps = {
    timezone : void 0
};

export default AccessSchedules;

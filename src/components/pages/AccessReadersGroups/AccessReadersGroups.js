import React, {
    useEffect,
    useState,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import PageStub                 from 'templater-ui/src/components/pages/PageStub';

import PageHeading              from 'Shared/PageHeading';

import pageStyles               from '../styles.less';
import Filters                  from './Filters';
import Table                    from './Table';
import styles                   from './AccessReadersGroups.less';

const cx = classnames.bind(styles);

function AccessReadersGroups(props) {
    const {
        amount, total, isFetching, filters, changeFilters, openModal,
        fetchAccessReadersGroups, list, refreshKey, timezone, t
    } = props;
    const {
        limit, offset, status, search, stateStatus, enabled, accessReadersGroupIds,
        updateStart, updateEnd, createStart, createEnd, isArchived, sortedBy, order
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchAccessReadersGroups();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order, accessReadersGroupIds,
        stateStatus, enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenCreateModal() {
        openModal('accessReadersGroup', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchAccessReadersGroups();
            },
            isCreateEntity : true
        });
    }

    const handleChangeFilters = useCallback(filtersToSet => {
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

        changeFilters(processFilters);
    }, []);

    return (
        <div className = {styles.AccessReadersGroups}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    className     = {pageStyles.pageHeading}
                    title         = {t('readers-groups-page:Spaces')}
                    buttonTitle   = {t('readers-groups-page:Create space')}
                    onButtonClick = {useCallback(handleOpenCreateModal, [])}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('readers-groups-page:No spaces to display')} <br />{t('readers-groups-page:You can create a new space')}</>}
                >
                    <Filters
                        filters          = {filters}
                        onChangeFilters  = {changeFilters}
                        t                = {t}
                    />

                    <div className={pageStyles.tableWrapper}>
                        <Table
                            list          = {isInitialized ? list : []}
                            total         = {amount}
                            offset        = {offset}
                            limit         = {limit}
                            isLoading     = {isFetching}
                            changeFilters = {handleChangeFilters}
                            filters       = {filters}
                            timezone      = {timezone}
                            t             = {t}
                        />
                    </div>
                </PageStub>
            </div>
        </div>
    );
}

AccessReadersGroups.propTypes = {
    list                     : PropTypes.array.isRequired,
    amount                   : PropTypes.number.isRequired,
    total                    : PropTypes.number.isRequired,
    isFetching               : PropTypes.bool.isRequired,
    filters                  : PropTypes.object.isRequired,
    changeFilters            : PropTypes.func.isRequired,
    fetchAccessReadersGroups : PropTypes.func.isRequired,
    openModal                : PropTypes.func.isRequired,
    refreshKey               : PropTypes.string.isRequired,
    timezone                 : PropTypes.string,
    t                        : PropTypes.func.isRequired
};

AccessReadersGroups.defaultProps = {
    timezone : void 0
};

export default AccessReadersGroups;

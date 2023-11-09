import React, {
    useEffect,
    useState,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import PageStub                 from 'templater-ui/src/components/pages/PageStub';
import { getData }              from 'templater-ui/src/utils/helpers/localStorage';
import { TABLE_COLUMNS_KEY }    from 'Constants/localStorage';
import PageHeading              from 'Shared/PageHeading';

import pageStyles               from '../styles.less';
import Filters                  from './Filters';
import Table                    from './Table';
import styles                   from './AccessTokenReaders.less';

const cx = classnames.bind(styles);

function AccessTokenReaders(props) {
    const {
        amount, isFetching, filters, changeFilters, openModal,
        fetchAccessTokenReaders, list, refreshKey, timezone, total,
        t, setVisibleColumns, visibleColumns
    } = props;
    const {
        limit, offset, status, search, connectionStatus, enabled, accessReadersGroupIds,
        updateStart, updateEnd, createStart, createEnd, isArchived, sortedBy, order
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        const { accessTokenReaders } = getData(TABLE_COLUMNS_KEY) || {};

        if (Array.isArray(accessTokenReaders)) setVisibleColumns(accessTokenReaders);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAccessTokenReaders();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order, accessReadersGroupIds,
        connectionStatus, enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenCreateModal() {
        openModal('accessTokenReader', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchAccessTokenReaders();
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
        <div className = {styles.AccessTokenReaders}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    className     = {pageStyles.pageHeading}
                    title         = {t('Access points')}
                    buttonTitle   = {t('readers-page:Create access point')}
                    onButtonClick = {useCallback(handleOpenCreateModal, [])}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('readers-page:No access points to display')} <br />{t('readers-page:You can create access point')}</>}
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
                            changeFilters     = {handleChangeFilters}
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

AccessTokenReaders.propTypes = {
    list                    : PropTypes.array.isRequired,
    visibleColumns          : PropTypes.array.isRequired,
    amount                  : PropTypes.number.isRequired,
    total                   : PropTypes.number.isRequired,
    isFetching              : PropTypes.bool.isRequired,
    filters                 : PropTypes.object.isRequired,
    changeFilters           : PropTypes.func.isRequired,
    setVisibleColumns       : PropTypes.func.isRequired,
    fetchAccessTokenReaders : PropTypes.func.isRequired,
    openModal               : PropTypes.func.isRequired,
    refreshKey              : PropTypes.string.isRequired,
    timezone                : PropTypes.string,
    t                       : PropTypes.func.isRequired
};

AccessTokenReaders.defaultProps = {
    timezone : void 0
};

export default AccessTokenReaders;

import React, {
    useEffect,
    useCallback,
    useState
}                                     from 'react';
import PropTypes                      from 'prop-types';
import classnames                     from 'classnames/bind';

import PageStub                       from 'templater-ui/src/components/pages/PageStub';
import { getData }                    from 'templater-ui/src/utils/helpers/localStorage';
import { TABLE_COLUMNS_KEY }          from 'Constants/localStorage';
import PageHeading                    from 'Shared/PageHeading';

import pageStyles                     from '../styles.less';
import Filters                        from './Filters';
import Table                          from './Table';
import styles                         from './Cameras.less';

const cx = classnames.bind(styles);

function Cameras(props) {
    const {
        amount, total, isFetching, filters, changeFilters,
        fetchList, list, openModal, refreshKey, timezone,
        setVisibleColumns, visibleColumns, t
    } = props;
    const {
        limit, offset, sortedBy, status, search, type, enabled,
        updateStart, updateEnd, createStart, createEnd, isArchived, order
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        const { cameras } = getData(TABLE_COLUMNS_KEY) || {};

        if (Array.isArray(cameras)) setVisibleColumns(cameras);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchList();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order,
        type, enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenCreateModal() {
        openModal('camera', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchList();
            },
            isCreateEntity : true
        });
    }

    return (
        <div className = {styles.Cameras}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    className     = {pageStyles.pageHeading}
                    title         = {t('Cameras')}
                    buttonTitle   = {t('cameras-page:Add camera')}
                    onButtonClick = {useCallback(handleOpenCreateModal, [])}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('cameras-page:No cameras to display')} <br />{t('cameras-page:You can add camera')}</>}
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

Cameras.propTypes = {
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
        enabled     : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        updateStart : PropTypes.string,
        updateEnd   : PropTypes.string,
        createStart : PropTypes.string,
        createEnd   : PropTypes.string,
        isArchived  : PropTypes.bool,
        order       : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    changeFilters     : PropTypes.func.isRequired,
    setVisibleColumns : PropTypes.func.isRequired,
    fetchList         : PropTypes.func.isRequired,
    openModal         : PropTypes.func.isRequired,
    refreshKey        : PropTypes.string.isRequired,
    timezone          : PropTypes.string,
    t                 : PropTypes.func.isRequired
};

Cameras.defaultProps = {
    timezone : void 0
};

export default Cameras;

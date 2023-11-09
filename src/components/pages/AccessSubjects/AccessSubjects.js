import React, {
    useEffect,
    useCallback,
    useState
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
import styles                   from './AccessSubjects.less';


const cx = classnames.bind(styles);

function AccessSubjects(props) {
    const {
        amount, total, isFetching, filters, changeFilters, openModal,
        fetchAccessSubjects, list, refreshKey, timezone, t, setVisibleColumns, visibleColumns
    } = props;
    const {
        limit, offset, status, search, stateStatus, enabled, mobileEnabled,
        updateStart, updateEnd, createStart, createEnd, isArchived, sortedBy, order
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        const { accessSubjects } = getData(TABLE_COLUMNS_KEY) || {};

        if (Array.isArray(accessSubjects)) setVisibleColumns(accessSubjects);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAccessSubjects();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order, mobileEnabled,
        stateStatus, enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenCreateModal() {
        openModal('accessSubject', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchAccessSubjects();
            },
            isCreateEntity : true
        });
    }

    return (
        <div className = {styles.AccessSubjects}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    className     = {pageStyles.pageHeading}
                    title         = {t('Subjects')}
                    buttonTitle   = {t('subjects-page:Create subject')}
                    onButtonClick = {useCallback(handleOpenCreateModal, [])}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('subjects-page:No subjects to display')} <br />{t('subjects-page:You can create subject')}</>}
                >
                    <Filters
                        filters         = {filters}
                        visibleColumns  = {visibleColumns}
                        onChangeFilters = {changeFilters}
                        t               = {t}
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

AccessSubjects.propTypes = {
    list           : PropTypes.array.isRequired,
    visibleColumns : PropTypes.array.isRequired,
    amount         : PropTypes.number.isRequired,
    total          : PropTypes.number.isRequired,
    isFetching     : PropTypes.bool.isRequired,
    filters        : PropTypes.shape({
        limit           : PropTypes.number,
        offset          : PropTypes.number,
        sortedBy        : PropTypes.string,
        status          : PropTypes.string,
        search          : PropTypes.string,
        type            : PropTypes.string,
        enabled         : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        mobileEnabled   : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        canAttachTokens : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
        updateStart     : PropTypes.string,
        updateEnd       : PropTypes.string,
        createStart     : PropTypes.string,
        createEnd       : PropTypes.string,
        isArchived      : PropTypes.bool,
        order           : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    changeFilters       : PropTypes.func.isRequired,
    setVisibleColumns   : PropTypes.func.isRequired,
    fetchAccessSubjects : PropTypes.func.isRequired,
    openModal           : PropTypes.func.isRequired,
    refreshKey          : PropTypes.string.isRequired,
    timezone            : PropTypes.string,
    t                   : PropTypes.func.isRequired
};

AccessSubjects.defaultProps = {
    timezone : void 0
};

export default AccessSubjects;

import React, {
    useEffect,
    useCallback,
    useState
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import PageStub                 from 'templater-ui/src/components/pages/PageStub';
import IconButton               from 'templater-ui/src/components/base/IconButton/IconButton';
import Button                   from 'templater-ui/src/components/base/Button';
import { getData }              from 'templater-ui/src/utils/helpers/localStorage';
import { TABLE_COLUMNS_KEY }    from 'Constants/localStorage';
import PageHeading              from 'Shared/PageHeading';

import pageStyles               from '../styles.less';
import Filters                  from './Filters';
import Table                    from './Table';

import styles                   from './AccessSubjectTokens.less';


const cx = classnames.bind(styles);

// eslint-disable-next-line max-lines-per-function
function AccessSubjectTokens(props) {
    const {
        amount, total, isFetching, filters, changeFilters,
        fetchAccessSubjectTokens, list, openModal, refreshKey, timezone,
        t, setVisibleColumns, visibleColumns
    } = props;
    const {
        limit, offset, sortedBy, status, search, type, enabled,
        updateStart, updateEnd, createStart, createEnd, isArchived, order
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        const { accessSubjectTokens } = getData(TABLE_COLUMNS_KEY) || {};

        if (Array.isArray(accessSubjectTokens)) setVisibleColumns(accessSubjectTokens);
    }, []);

    useEffect(() => {
        (async () => {
            await fetchAccessSubjectTokens();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        isArchived, offset, status, sortedBy, search, order,
        type, enabled, updateStart, updateEnd, createStart, createEnd, refreshKey
    ]);

    function handleOpenCreateModal() {
        openModal('accessSubjectToken', {
            onClose : ({ entity } = {}) => {
                if (entity) fetchAccessSubjectTokens();
            },
            isCreateEntity : true
        });
    }

    function handleOpenCreateTagsModal() {
        openModal('accessSubjectTokens', {
            onSuccessImport : ({ isSuccess } = {}) => {
                if (isSuccess) fetchAccessSubjectTokens();
            }
        });
    }

    function renderPageHeadingButtons({ isMobile }) {
        return isMobile ? (
            <>
                <IconButton
                    className = {cx(styles.createMobileButton, styles.primaryOutlined)}
                    type      = 'abort-submit'
                    onClick   = {useCallback(handleOpenCreateTagsModal, [])}
                    iconType  = 'addMultiple'
                />

                <IconButton
                    className = {styles.createMobileButton}
                    onClick   = {useCallback(handleOpenCreateModal, [])}
                    iconType  = 'addSingle'
                />
            </>
        ) : (
            <>
                <Button
                    color     = 'primary600'
                    onClick   = {useCallback(handleOpenCreateTagsModal, [])}
                    className = {styles.createButton}
                    size      = 'L'
                >
                    { t('tokens-page:Create multiple tags') }
                </Button>

                <Button
                    color     = 'actionButton'
                    onClick   = {useCallback(handleOpenCreateModal, [])}
                    className = {styles.createButton}
                    size      = 'L'
                >
                    { t('tokens-page:Create tag') }
                </Button>
            </>
        );
    }

    return (
        <div className = {styles.AccessSubjectTokens}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <PageHeading
                    title                = {t('Tags')}
                    renderCustomControls = {renderPageHeadingButtons}
                />

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('tokens-page:No tags to display')} <br />{t('tokens-page:You can create tag')}</>}
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

AccessSubjectTokens.propTypes = {
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
        order       : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    changeFilters            : PropTypes.func.isRequired,
    setVisibleColumns        : PropTypes.func.isRequired,
    fetchAccessSubjectTokens : PropTypes.func.isRequired,
    openModal                : PropTypes.func.isRequired,
    refreshKey               : PropTypes.string.isRequired,
    timezone                 : PropTypes.string,
    t                        : PropTypes.func.isRequired
};

AccessSubjectTokens.defaultProps = {
    timezone : void 0
};

export default AccessSubjectTokens;

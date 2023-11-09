import React, {
    useEffect,
    useState
}                               from 'react';
import classnames               from 'classnames/bind';
import PropTypes                from 'prop-types';

import PageStub                 from 'templater-ui/src/components/pages/PageStub';
import Typography               from 'templater-ui/src/components/base/Typography';

import pageStyles               from '../styles.less';
import Table                    from './Table';
import Filters                  from './Filters';
import styles                   from './AccessLogs.less';

const cx = classnames.bind(styles);

function AccessLogs(props) {    /* eslint-disable-line max-lines-per-function */
    const {
        amount, total, isFetching, filters, changeFilters,
        fetchAccessLogs, list, refreshKey, timezone, t
    } = props;
    const {
        limit, offset, sortedBy, status, search, initiatorTypes, enabled,
        createStart, createEnd, order, accessTokenReaderIds
    } = filters;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        (async () => {
            await fetchAccessLogs();
            if (!isInitialized) setIsInitialized(true);
        })();
    }, [
        offset, status, sortedBy, search, order,
        initiatorTypes, enabled, createStart, createEnd, accessTokenReaderIds, refreshKey
    ]);

    return (
        <div className={cx(styles.AccessLogs)}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <div className={styles.heading}>
                    <Typography
                        variant   = 'headline2'
                        color     = 'primary900'
                        className = {cx(pageStyles.pageTitle, styles.pageTitle)}
                    >
                        {t('access-logs-page:Access logs')}
                    </Typography>
                </div>

                <PageStub
                    isInitialized = {isInitialized}
                    total         = {total}
                    emptyMessage  = {<>{t('tables:No data to display')}<br />{t('access-logs-page:Access log is empty')}</>}
                >
                    <Filters
                        filters         = {filters}
                        onChangeFilters = {changeFilters}
                        t               = {t}
                    />

                    <div className={pageStyles.tableWrapper}>
                        <Table
                            list          = {isInitialized ? list : []}
                            total         = {amount}
                            offset        = {offset}
                            limit         = {limit}
                            isLoading     = {isFetching}
                            changeFilters = {changeFilters}
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

AccessLogs.propTypes = {
    list       : PropTypes.array.isRequired,
    amount     : PropTypes.number.isRequired,
    total      : PropTypes.number.isRequired,
    isFetching : PropTypes.bool.isRequired,
    filters    : PropTypes.shape({
        status               : PropTypes.oneOf([ 'SUCCESS', 'DENIED', '' ]),
        initiatorTypes       : PropTypes.array,
        limit                : PropTypes.number,
        offset               : PropTypes.number,
        sortedBy             : PropTypes.string,
        search               : PropTypes.string,
        enabled              : PropTypes.bool,
        createStart          : PropTypes.string,
        createEnd            : PropTypes.string,
        accessTokenReaderIds : PropTypes.array,
        order                : PropTypes.oneOf([ 'ASC', 'DESC' ])
    }).isRequired,
    changeFilters   : PropTypes.func.isRequired,
    fetchAccessLogs : PropTypes.func.isRequired,
    timezone        : PropTypes.string,
    refreshKey      : PropTypes.string.isRequired,
    t               : PropTypes.func.isRequired
};

AccessLogs.defaultProps = {
    timezone : void 0
};

export default AccessLogs;

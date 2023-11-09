import React, {
// useEffect,
// useState
}                               from 'react';
import classnames               from 'classnames/bind';
// import PropTypes                from 'prop-types';

import Typography               from './../../base/Typography';

import pageStyles               from './../styles.less';
// import Table                    from './Table';
// import Filters                  from './Filters';
import styles                   from './Dashboard.less';

const cx = classnames.bind(styles);

function Dashboard() {
    // const {
    //     amount, isFetching, filters, changeFilters,
    //     // fetchList,
    //     list, refreshKey
    // } = props;
    // const {
    //     limit, offset, sortedBy, status, search, tokenType, enabled,
    //     createStart, createEnd, order, accessTokenReaderIds
    // } = filters;

    // const [ isInitialized, setIsInitialized ] = useState(false);

    // useEffect(() => {
    //     (async () => {
    //         // await fetchList();
    //         if (!isInitialized) setIsInitialized(true);
    //     })();
    // }, [
    //     offset, status, sortedBy, search, order,
    //     tokenType, enabled, createStart, createEnd, accessTokenReaderIds, refreshKey
    // ]);

    return (
        <div className={cx(styles.Dashboard)}>
            <div
                className = {cx('scroll-content', pageStyles.pageContent)}  // need this to fix select scroll on mobile
            >
                <div className={styles.heading}>
                    <Typography
                        variant   = 'headline2'
                        color     = 'primary900'
                        className = {cx(pageStyles.pageTitle, styles.pageTitle)}
                    >
                        Dashboard
                    </Typography>
                </div>

                {/*
                <Filters
                    filters         = {filters}
                    onChangeFilters = {changeFilters}
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
                    />
                </div>
                */}
            </div>
        </div>
    );
}

Dashboard.propTypes = {
    // list       : PropTypes.array.isRequired,
    // amount     : PropTypes.number.isRequired,
    // isFetching : PropTypes.bool.isRequired,
    // filters    : PropTypes.shape({
    //     status               : PropTypes.oneOf([ 'SUCCESS', 'DENIED', '' ]),
    //     tokenType            : PropTypes.oneOf([ 'all', 'mobile', 'notMobile' ]),
    //     limit                : PropTypes.number,
    //     offset               : PropTypes.number,
    //     sortedBy             : PropTypes.string,
    //     search               : PropTypes.string,
    //     enabled              : PropTypes.bool,
    //     createStart          : PropTypes.string,
    //     createEnd            : PropTypes.string,
    //     accessTokenReaderIds : PropTypes.array,
    //     order                : PropTypes.oneOf([ 'ASC', 'DESC' ])
    // }).isRequired,
    // changeFilters   : PropTypes.func.isRequired,
    // fetchAccessLogs : PropTypes.func.isRequired,
    // refreshKey      : PropTypes.string.isRequired
};

export default Dashboard;

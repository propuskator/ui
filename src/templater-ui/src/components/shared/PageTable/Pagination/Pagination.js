import React, {
    useCallback
}                     from 'react';
import PropTypes      from 'prop-types';
import Pagination     from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    root : {
        float                       : 'right',
        padding                     : 10,
        '& .MuiPaginationItem-page' : {
            color      : '#8E8E8E',
            fontFamily : 'sans-serif',
            fontSize   : '14px',
            fontWeight : '300'
        },
        '& .MuiPaginationItem-page.Mui-disabled' : {
            cursor        : 'not-allowed',
            pointerEvents : 'auto'

        },
        '& .MuiPaginationItem-page.Mui-disabled:hover' : {
            backgroundColor : 'transparent'
        },
        '& .MuiPaginationItem-page.Mui-selected' : {
            fontWeight      : 'bold',
            backgroundColor : '#fff !important'
        },
        '& .MuiPaginationItem-sizeSmall' : {
            minWidth   : '29px',
            height     : '29px',
            fontSize   : '16px',
            marginLeft : '3px !important'
        },
        '& .MuiPaginationItem-ellipsis' : {
            userSelect : 'none'
        }
    }
}));

export default function CustomPagination(props) {
    const { onChangePage, rowsTotalCount, rowsPerPage, currentPage } = props;
    const pagesAmount = Math.ceil(rowsTotalCount / rowsPerPage);
    const classes = useStyles();
    const handlePageChange = useCallback((e, page) => {
        onChangePage(page);
    }, []);


    // if pagesAmount is less than the current page, the current page is replaced with a new pagesAmounts
    if (currentPage > pagesAmount) {
        onChangePage(pagesAmount);

        return null;
    }

    if (pagesAmount < 2) return null; /* eslint-disable-line no-magic-numbers */

    return (
        <Pagination
            className = {classes.root}
            count     = {pagesAmount}
            size      = 'small'
            onChange  = {handlePageChange}
            page      = {currentPage}
            // siblingCount={pagesAmount >= 5 ? 0 : undefined} /* eslint-disable-line no-magic-numbers */
        />
    );
}

CustomPagination.propTypes = {
    rowsTotalCount : PropTypes.number,
    rowsPerPage    : PropTypes.number,
    onChangePage   : PropTypes.func,
    currentPage    : PropTypes.number
};


CustomPagination.defaultProps = {
    rowsTotalCount : 0,
    rowsPerPage    : 0,
    onChangePage   : void 0,
    currentPage    : 0
};


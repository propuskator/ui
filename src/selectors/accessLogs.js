import { createSelector } from 'reselect';

export const accessLogsListSelector         = state => state?.accessLogs?.list;
export const accessLogsAmountSelector       = state => state?.accessLogs?.amount;
export const accessLogsTotalSelector       = state => state?.accessLogs?.total;
export const accessLogsIsFetchingSelector   = state => state?.accessLogs?.isFetching;
export const accessLogsFiltersSelector      = state => state?.accessLogs?.filters;
export const accessLogsIsLoadingCsvSelector = state => state?.accessLogs?.isLoadingCsv;

const selectItemId = (state, itemId) => itemId; // eslint-disable-line

export const accessLogSelector = createSelector(
    [ accessLogsListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable-line
);

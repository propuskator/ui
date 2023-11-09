import { createSelector } from 'reselect';

export const accessTokenReadersListSelector       = state => state.accessTokenReaders.list;
export const accessTokenReadersAmountSelector     = state => state.accessTokenReaders.amount;
export const accessTokenReadersTotalSelector      = state => state.accessTokenReaders.total;
export const accessTokenReadersIsFetchingSelector = state => state.accessTokenReaders.isFetching;
export const accessTokenReadersFiltersSelector    = state => state.accessTokenReaders.filters;
export const accessTokenReadersVisibleColumnsSelector = state => state.accessTokenReaders.visibleColumns;

const selectItemId = (state, itemId) => itemId; // eslint-disable0line

export const accessTokenReaderSelector = createSelector(
    [ accessTokenReadersListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable0line
);

import { createSelector } from 'reselect';

export const camerasListSelector       = state => state.cameras.list;
export const camerasAmountSelector     = state => state.cameras.amount;
export const camerasTotalSelector      = state => state.cameras.total;
export const camerasIsFetchingSelector = state => state.cameras.isFetching;
export const camerasFiltersSelector    = state => state.cameras.filters;
export const camerasVisibleColumnsSelector = state => state.cameras.visibleColumns;


const selectItemId = (state, itemId) => itemId; // eslint-disable-line

export const cameraSelector = createSelector(
    [ camerasListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable-line
);

import { createSelector } from 'reselect';

export const accessReadersGroupsListSelector       = state => state.accessReadersGroups.list;
export const accessReadersGroupAmountSelector      = state => state.accessReadersGroups.amount;
export const accessReadersGroupTotalSelector       = state => state.accessReadersGroups.total;
export const accessReadersGroupsIsFetchingSelector = state => state.accessReadersGroups.isFetching;
export const accessReadersGroupsFiltersSelector    = state => state.accessReadersGroups.filters;

const selectItemId = (state, itemId) => itemId; // eslint-disable-line

export const accessReadersGroupSelector = createSelector(
    [ accessReadersGroupsListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable-line
);

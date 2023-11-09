import { createSelector } from 'reselect';

export const accessSubjectTokensListSelector       = state => state.accessSubjectTokens.list;
export const accessSubjectTokensAmountSelector     = state => state.accessSubjectTokens.amount;
export const accessSubjectTokensTotalSelector      = state => state.accessSubjectTokens.total;
export const accessSubjectTokensIsFetchingSelector = state => state.accessSubjectTokens.isFetching;
export const accessSubjectTokensFiltersSelector    = state => state.accessSubjectTokens.filters;
export const accessSubjectTokensVisibleColumnsSelector = state => state.accessSubjectTokens.visibleColumns;

const selectItemId = (state, itemId) => itemId; // eslint-disable-line

export const accessSubjectTokenSelector = createSelector(
    [ accessSubjectTokensListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable-line
);

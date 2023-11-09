/* eslint-disable func-style */
import { createSelector } from 'reselect';

export const accessSubjectsListSelector         = state => state.accessSubjects.list;
export const accessSubjectsFiltersSelector      = state => state.accessSubjects.filters;
export const accessSubjectsIsFetchingSelector   = state => state.accessSubjects.isFetching;
export const accessSubjectsAmountSelector       = state => state.accessSubjects.amount;
export const accessSubjectsTotalSelector        = state => state.accessSubjects.total;
export const accessSubjectsIsLoadingCsvSelector = state => state.accessSubjects.isLoadingCsv;
export const accessSubjectsVisibleColumnsSelector = state => state.accessSubjects.visibleColumns;

const selectItemId = (state, itemId) => itemId; // eslint-disable0line

export const accessSubjectSelector = createSelector(
    [ accessSubjectsListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable0line
);

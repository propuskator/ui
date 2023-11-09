import { createSelector } from 'reselect';

export const accessSchedulesListSelector       = state => state.accessSchedules.list;
export const accessSchedulesAmountSelector     = state => state.accessSchedules.amount;
export const accessSchedulesTotalSelector      = state => state.accessSchedules.total;
export const accessSchedulesIsFetchingSelector = state => state.accessSchedules.isFetching;
export const accessSchedulesFiltersSelector    = state => state.accessSchedules.filters;
export const accessSchedulesVisibleColumnsSelector = state => state.accessSchedules.visibleColumns;


const selectItemId = (state, itemId) => itemId; // eslint-disable0line

export const accessScheduleSelector = createSelector(
    [ accessSchedulesListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable0line
);

import { createSelector } from 'reselect';

export const accessSettingsListSelector              = state => state.accessSettings.list;
export const accessSettingsAmountSelector            = state => state.accessSettings.amount;
export const accessSettingsTotalSelector             = state => state.accessSettings.total;
export const accessSettingsIsFetchingSelector        = state => state.accessSettings.isFetching;
export const accessSettingsFiltersSelector           = state => state.accessSettings.filters;
export const accessSettingsVisibleColumnsSelector    = state => state.accessSettings.visibleColumns;

const selectItemId = (state, itemId) => itemId; // eslint-disable0line

export const accessSettingSelector = createSelector(
    [ accessSettingsListSelector, selectItemId  ],
    (list, id) => list?.find(entity => entity.id === id) // eslint-disable0line
);

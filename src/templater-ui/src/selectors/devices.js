import { createSelector } from 'reselect';

export const devicesByIdSelector       = state => state?.devices?.byID || {};
export const devicesIsFetchingSelector = state => state?.devices?.isFetching || false;
export const processingTopicsSelector  = state => state?.devices?.processingTopics || [];

const selectItemId = (state, itemId) => itemId;  // eslint-disable-line

export const deviceSelector = createSelector(
    [ devicesByIdSelector, selectItemId  ],
    (map, id) => map[id]
);

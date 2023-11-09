import { createSelector } from 'reselect';

export const devicesByIdSelector = state => state?.devices?.byID || {};

const selectItemId = (state, itemId) => itemId;  // eslint-disable-line

export const deviceSelector = createSelector(
    [ devicesByIdSelector, selectItemId  ],
    (map, id) => map[id]
);

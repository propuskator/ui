// import { createSelector } from 'reselect';

export const accountLoginSelector     = state => state?.accountSettings?.login;
export const accountAvatarSelector    = state => state?.accountSettings?.avatar;
export const accountWorkspaceSelector = state => state?.accountSettings?.workspace;


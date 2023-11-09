import api             from 'ApiSingleton';
import {
    accessReadersGroupsListSelector,
    accessReadersGroupsFiltersSelector
}                      from 'Selectors/accessReadersGroups';
import { addToast }    from 'Actions/toasts';
import { TOASTS_KEYS } from 'Constants/toasts';
import i18n            from 'I18next';


export const FETCH_ACCESS_READERS_GROUPS_REQUEST  = 'FETCH_ACCESS_READERS_GROUPS_REQUEST';
export const FETCH_ACCESS_READERS_GROUPS_SUCCESS  = 'FETCH_ACCESS_READERS_GROUPS_SUCCESS';
export const FETCH_ACCESS_READERS_GROUPS_ERROR    = 'FETCH_ACCESS_READERS_GROUPS_ERROR';
export const UPDATE_ACCESS_READERS_GROUP_SUCCESS  = 'UPDATE_ACCESS_READERS_GROUP_SUCCESS';

export const DELETE_ACCESS_READERS_GROUP_REQUEST = 'DELETE_ACCESS_READERS_GROUP_REQUEST';
export const DELETE_ACCESS_READERS_GROUP_SUCCESS = 'DELETE_ACCESS_READERS_GROUP_SUCCESS';
export const DELETE_ACCESS_READERS_GROUP_ERROR   = 'DELETE_ACCESS_READERS_GROUP_ERROR';

export const CLEAR_ACCESS_READERS_GROUPS         = 'CLEAR_ACCESS_READERS_GROUPS';
export const UPDATE_ACCESS_READERS_GROUPS_FILTER = 'UPDATE_ACCESS_READERS_GROUPS_FILTER';

export function fetchAccessReadersGroups(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ACCESS_READERS_GROUPS_REQUEST });

        try {
            const state = getState();
            const requestParams = params ? params : accessReadersGroupsFiltersSelector(state);

            const { isMergeList = false, ...restParams } = requestParams;
            const { data = [], meta } = await api.accessReadersGroups.list(restParams);

            let dataToSet = data;

            if (isMergeList) {
                const initialList = (accessReadersGroupsListSelector(state) || []);
                const initialWithoutDuplicates = initialList.filter(item =>
                    !data.find(entity => entity.id === item.id));

                dataToSet = [ ...initialWithoutDuplicates, ...data ];
            }

            dispatch({
                type    : FETCH_ACCESS_READERS_GROUPS_SUCCESS,
                payload : {
                    data : dataToSet,
                    meta
                }
            });

            return { data: dataToSet, meta };
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_ACCESS_READERS_GROUPS_ERROR });
        }
    };
}

export function createAccessReadersGroup(data) {
    return async dispatch => {
        try {
            const response = await api.accessReadersGroups.create(data);

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_READERS_GROUPS_ERROR });

            throw error;
        }
    };
}

export function clearAccessReadersGroups() {
    return {
        type : CLEAR_ACCESS_READERS_GROUPS
    };
}

export function updateAccessReadersGroup({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessReadersGroups.edit(id, data);
            const entity = response?.data;

            // dispatch({
            //     type    : UPDATE_ACCESS_READERS_GROUP_SUCCESS,
            //     payload : {
            //         id,
            //         entity
            //     }
            // });

            return entity;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_READERS_GROUPS_ERROR });

            throw error;
        }
    };
}

export function changeFilters(filters) {
    return {
        type    : UPDATE_ACCESS_READERS_GROUPS_FILTER,
        payload : {
            filters
        }
    };
}

export function deleteAccessReadersGroup({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessReadersGroups.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.accessTokenReaderUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('readers-groups-page:Space has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessTokenReaderUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('readers-groups-page:Space hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

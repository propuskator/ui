import api                       from 'ApiSingleton';
import {
    accessSettingsFiltersSelector,
    accessSettingsVisibleColumnsSelector
}                                from 'Selectors/accessSettings';
import { addToast }              from 'Actions/toasts';
import { TOASTS_KEYS }           from 'Constants/toasts';
import i18n                      from 'I18next';
import {
    resetFiltersByColumns,
    setTableColumnsInStorage
}                                from 'Utils/tables';

export const FETCH_ACCESS_SETTINGS_REQUEST  = 'FETCH_ACCESS_SETTINGS_REQUEST';
export const FETCH_ACCESS_SETTINGS_SUCCESS  = 'FETCH_ACCESS_SETTINGS_SUCCESS';
export const FETCH_ACCESS_SETTINGS_ERROR    = 'FETCH_ACCESS_SETTINGS_ERROR';
export const UPDATE_ACCESS_SETTING_SUCCESS  = 'UPDATE_ACCESS_SETTING_SUCCESS';
export const UPDATE_ACCESS_SETTINGS_FILTER  = 'UPDATE_ACCESS_SETTINGS_FILTER';
export const UPDATE_ACCESS_SETTINGS_COLUMNS = 'UPDATE_ACCESS_SETTINGS_COLUMNS';

function dumpAccessSetting(data) {
    return data;
}

export function fetchAccessSettings(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ACCESS_SETTINGS_REQUEST });

        try {
            const requestParams = params ? params : accessSettingsFiltersSelector(getState());
            const { readersIds, ...restParams } = requestParams || {};  // eslint-disable-line no-unused-vars
            const { data, meta } = await api.accessSettings.list(restParams);

            dispatch({
                type    : FETCH_ACCESS_SETTINGS_SUCCESS,
                payload : {
                    data : data.map(dumpAccessSetting),
                    meta
                }
            });

            return data;
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_ACCESS_SETTINGS_ERROR });
        }
    };
}

export const CREATE_ACCESS_SETTING = 'CREATE_ACCESS_SETTING';

export function createAccessSetting(data) {
    return async dispatch => {
        try {
            const response = await api.accessSettings.create(data);

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SETTINGS_ERROR });

            throw error;
        }
    };
}

export function updateAccessSetting({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessSettings.edit(id, data);

            dispatch({
                type    : UPDATE_ACCESS_SETTING_SUCCESS,
                payload : {
                    id,
                    accessSetting : dumpAccessSetting(response.data)
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SETTINGS_ERROR });

            throw error;
        }
    };
}


export function patchAccessSetting({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessSettings.patch(id, data);

            dispatch({
                type    : UPDATE_ACCESS_SETTING_SUCCESS,
                payload : {
                    id,
                    accessSetting : dumpAccessSetting(response.data)
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SETTINGS_ERROR });

            throw error;
        }
    };
}


export function changeFilters(filters) {
    return {
        type    : UPDATE_ACCESS_SETTINGS_FILTER,
        payload : {
            filters
        }
    };
}

export function setVisibleColumns(visibleColumns = []) {
    return (dispatch, getState) => {
        const prevVisibleColumns = accessSettingsVisibleColumnsSelector(getState());

        // save columns to store and localStorage
        dispatch({ type: UPDATE_ACCESS_SETTINGS_COLUMNS, payload: { visibleColumns } });
        setTableColumnsInStorage('accessSettings', visibleColumns);

        if (prevVisibleColumns?.length > visibleColumns?.length) {
            const filters = accessSettingsFiltersSelector(getState());
            const colsDifference = prevVisibleColumns?.filter(col => !visibleColumns?.includes(col));

            const newFilters = resetFiltersByColumns(colsDifference, filters, 'enabled');

            dispatch(changeFilters(newFilters));
        }
    };
}

export function deleteAccessSetting({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessSettings.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.accessSettingUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('access-page:Access has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessSettingUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('access-page:Access hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

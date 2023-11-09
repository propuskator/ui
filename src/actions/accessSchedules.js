import api                              from 'ApiSingleton';
import {
    accessSchedulesListSelector,
    accessSchedulesFiltersSelector,
    accessSchedulesVisibleColumnsSelector
}                                       from 'Selectors/accessSchedules';
import { addToast }                     from 'Actions/toasts';
import { TOASTS_KEYS }                  from 'Constants/toasts';
import i18n                             from 'I18next';
import {
    resetFiltersByColumns,
    setTableColumnsInStorage
}                                       from 'Utils/tables';

export const FETCH_ACCESS_SCHEDULES_REQUEST   = 'FETCH_ACCESS_SCHEDULES_REQUEST';
export const FETCH_ACCESS_SCHEDULES_SUCCESS   = 'FETCH_ACCESS_SCHEDULES_SUCCESS';
export const FETCH_ACCESS_SCHEDULES_ERROR     = 'FETCH_ACCESS_SCHEDULES_ERROR';
export const UPDATE_ACCESS_SCHEDULE_SUCCESS   = 'UPDATE_ACCESS_SCHEDULE_SUCCESS';
export const UPDATE_FILTER_SUCCESS            = 'UPDATE_ACCESS_SCHEDULE_FILTER_SUCCESS';
export const UPDATE_ACCESS_SCHEDULE_COLUMNS   = 'UPDATE_ACCESS_SCHEDULE_COLUMNS';

export function fetchAccessSchedules(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ACCESS_SCHEDULES_REQUEST });

        try {
            const state = getState();
            const requestParams = params ? params : accessSchedulesFiltersSelector(state);
            const { isMergeList = false, ...restParams } = requestParams;
            const { data, meta } = await api.accessSchedules.list(restParams);

            let dataToSet = data;

            if (isMergeList) {
                const initialList = (accessSchedulesListSelector(state) || []);
                const initialWithoutDuplicates = initialList.filter(item =>
                    !data.find(entity => entity.id === item.id));

                dataToSet = [ ...initialWithoutDuplicates, ...data ];
            }

            dispatch({
                type    : FETCH_ACCESS_SCHEDULES_SUCCESS,
                payload : {
                    data : dataToSet,
                    meta
                }
            });

            return { data: dataToSet, meta };
        } catch (error) {
            console.log({ error });

            dispatch({ type: FETCH_ACCESS_SCHEDULES_ERROR });
        }
    };
}

export function updateAccessSchedule({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessSchedules.edit(id, data);

            dispatch({
                type    : UPDATE_ACCESS_SCHEDULE_SUCCESS,
                payload : {
                    id,
                    accessSchedule : response.data
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SCHEDULES_ERROR });

            throw error;
        }
    };
}

export function createAccessSchedule(data) {
    return async dispatch => {
        try {
            const response = await api.accessSchedules.create(data);

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SCHEDULES_ERROR });

            throw error;
        }
    };
}

export function changeFilters(filter) {
    return {
        type    : UPDATE_FILTER_SUCCESS,
        payload : filter
    };
}

export function setVisibleColumns(visibleColumns = []) {
    return (dispatch, getState) => {
        const prevVisibleColumns = accessSchedulesVisibleColumnsSelector(getState());

        dispatch({ type: UPDATE_ACCESS_SCHEDULE_COLUMNS, payload: { visibleColumns } });
        setTableColumnsInStorage('accessSchedules', visibleColumns);

        if (prevVisibleColumns?.length > visibleColumns?.length) {
            const filters = accessSchedulesFiltersSelector(getState());
            const colsDifference = prevVisibleColumns?.filter(col => !visibleColumns?.includes(col));

            const newFilters = resetFiltersByColumns(colsDifference, filters, 'name');

            dispatch(changeFilters(newFilters));
        }
    };
}

export function deleteAccessSchedule({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessSchedules.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.accessScheduleUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('schedules-page:Schedule has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessScheduleUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('schedules-page:Schedule hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

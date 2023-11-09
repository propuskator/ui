import api                              from 'ApiSingleton';
import {
    camerasFiltersSelector,
    camerasListSelector,
    camerasVisibleColumnsSelector
}                                       from 'Selectors/cameras';
import { addToast }                     from 'Actions/toasts';
import { TOASTS_KEYS }                  from 'Constants/toasts';
import i18n                             from 'I18next';
import {
    resetFiltersByColumns,
    setTableColumnsInStorage
}                                       from 'Utils/tables';

export const FETCH_CAMERAS_REQUEST   = 'FETCH_CAMERAS_REQUEST';
export const FETCH_CAMERAS_SUCCESS   = 'FETCH_CAMERAS_SUCCESS';
export const FETCH_CAMERAS_ERROR     = 'FETCH_CAMERAS_ERROR';
export const UPDATE_CAMERA_SUCCESS   = 'UPDATE_CAMERA_SUCCESS';
export const UPDATE_FILTER_SUCCESS   = 'UPDATE_CAMERAS_FILTER_SUCCESS';
export const UPDATE_CAMERAS_COLUMNS  = 'UPDATE_CAMERAS_COLUMNS';

export function fetchCameras(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_CAMERAS_REQUEST });

        try {
            const state = getState();
            const requestParams = params ? params : camerasFiltersSelector(state);
            const { isMergeList = false, ...restParams } = requestParams;

            const { data, meta } = await api.cameras.list(restParams);

            let dataToSet = data;

            if (isMergeList) {
                const initialList = (camerasListSelector(state) || []);
                const initialWithoutDuplicates = initialList.filter(item =>
                    !data.find(entity => entity.id === item.id));

                dataToSet = [ ...initialWithoutDuplicates, ...data ];
            }

            dispatch({
                type    : FETCH_CAMERAS_SUCCESS,
                payload : {
                    data : dataToSet,
                    meta
                }
            });

            return { data: dataToSet, meta };
        } catch (error) {
            dispatch({ type: FETCH_CAMERAS_ERROR });
        }
    };
}

export function updateCamera({ id, data } = {}) {
    return async dispatch => {
        try {
            const response = await api.cameras.edit(id, data);

            dispatch({
                type    : UPDATE_CAMERA_SUCCESS,
                payload : {
                    id,
                    accessSubjectToken : response.data
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_CAMERAS_ERROR });

            throw error;
        }
    };
}

export function createCamera(data) {
    return async dispatch => {
        try {
            const response = await api.cameras.create(data);

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_CAMERAS_ERROR });

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
        const prevVisibleColumns = camerasVisibleColumnsSelector(getState());

        dispatch({ type: UPDATE_CAMERAS_COLUMNS, payload: { visibleColumns } });
        setTableColumnsInStorage('cameras', visibleColumns);

        if (prevVisibleColumns?.length > visibleColumns?.length) {
            const filters = camerasFiltersSelector(getState());
            const colsDifference = prevVisibleColumns?.filter(col => !visibleColumns?.includes(col));

            const newFilters = resetFiltersByColumns(colsDifference, filters, 'name');

            dispatch(changeFilters(newFilters));
        }
    };
}

export function deleteCamera({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.cameras.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.camerasUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('cameras-page:Camera has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.camerasUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('cameras-page:Camera hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

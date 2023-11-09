import api                         from 'ApiSingleton';
import { formatDate }              from 'Utils/date';
import {
    accessSubjectTokensFiltersSelector,
    accessSubjectTokensListSelector,
    accessSubjectTokensVisibleColumnsSelector
}                                  from 'Selectors/accessSubjectTokens';
import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';
import { addToast }                from 'Actions/toasts';
import { TOASTS_KEYS }             from 'Constants/toasts';
import i18n                        from 'I18next';
import {
    resetFiltersByColumns,
    setTableColumnsInStorage
}                                  from 'Utils/tables';

export const FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_REQUEST   = 'FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_REQUEST';
export const FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_SUCCESS   = 'FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_SUCCESS';
export const FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_ERROR     = 'FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_ERROR';
export const UPDATE_ACCESS_SUBJECT_TOKEN_SUCCESS          = 'UPDATE_ACCESS_SUBJECT_TOKEN_SUCCESS';
export const UPDATE_FILTER_SUCCESS                        = 'UPDATE_ACCESS_SUBJECT_TOKENS_FILTER_SUCCESS';
export const UPDATE_ACCESS_SUBJECT_TOKEN_COLUMNS          = 'UPDATE_ACCESS_SUBJECT_TOKEN_COLUMNS';

export const START_LOADING_ACCESS_SUBJECT_TOKENS_CSV = 'START_LOADING_ACCESS_SUBJECT_TOKENS_CSV';
export const END_LOADING_ACCESS_SUBJECT_TOKENS_CSV   = 'END_LOADING_ACCESS_SUBJECT_TOKENS_CSV';

export function fetchAccessSubjectTokens(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_REQUEST });

        try {
            const state = getState();
            const requestParams = params ? params : accessSubjectTokensFiltersSelector(state);
            const { isMergeList = false, ...restParams } = requestParams;

            const { data, meta } = await api.accessSubjectTokens.list(restParams);

            let dataToSet = data;

            if (isMergeList) {
                const initialList = (accessSubjectTokensListSelector(state) || []);
                const initialWithoutDuplicates = initialList.filter(item =>
                    !data.find(entity => entity.id === item.id));

                dataToSet = [ ...initialWithoutDuplicates, ...data ];
            }

            dispatch({
                type    : FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_SUCCESS,
                payload : {
                    data : dataToSet,
                    meta
                }
            });

            return { data: dataToSet, meta };
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_ERROR });
        }
    };
}

export function fetchAccessSubjectTokensCsv() {
    return async (dispatch, getState) => {
        dispatch({ type: START_LOADING_ACCESS_SUBJECT_TOKENS_CSV });

        try {
            const state = getState();
            const timezone = workspaceTimezoneSelector(state);
            const content = await api.accessSubjectTokens.exportCsv();

            const a = document.createElement('a');
            const currentDate = formatDate({ date: new Date(), format: 'DD.MM.YY_HH:mm', timezone });

            a.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(content)}`);

            a.download = `${i18n.t('Tags')}_${currentDate}.csv`;

            a.click();
        } catch (error) {
            console.error({ error });

            dispatch(addToast({
                key     : TOASTS_KEYS.csvAccessSubjectTokens,
                title   : i18n.t('toasts:Something went wrong'),
                message : i18n.t('toasts:Failed to generate csv file "Tags"'),
                type    : 'error'
            }));
        } finally {
            dispatch({ type: END_LOADING_ACCESS_SUBJECT_TOKENS_CSV });
        }
    };
}

export function updateAccessSubjectToken({ id, data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessSubjectTokens.edit(id, data);

            dispatch({
                type    : UPDATE_ACCESS_SUBJECT_TOKEN_SUCCESS,
                payload : {
                    id,
                    accessSubjectToken : response.data
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_ERROR });

            throw error;
        }
    };
}

export function createAccessSubjectToken(data) {
    return async dispatch => {
        try {
            const response = await api.accessSubjectTokens.create(data);

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_ACCESS_SUBJECT_TOKENS_ERROR });

            throw error;
        }
    };
}

export function createAccessSubjectTokens(data) {
    return async dispatch => {
        try {
            const response = await api.accessSubjectTokens.createBulk({ data });
            const { data : list, meta } = response;
            const amount = meta?.createdQuant;

            if (amount > 0) {
                dispatch(addToast({
                    key     : TOASTS_KEYS.accessSubjectTokens,
                    title   : i18n.t('Action was completed successfully'),
                    message : i18n.t('tokens-page:Tags has been created', { amount }),
                    type    : 'success'
                }));
            }

            return list;
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessSubjectTokens,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('tokens-page:Tags hasn\'t been created'),
                type    : 'error'
            }));

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
        const prevVisibleColumns = accessSubjectTokensVisibleColumnsSelector(getState());

        dispatch({ type: UPDATE_ACCESS_SUBJECT_TOKEN_COLUMNS, payload: { visibleColumns } });
        setTableColumnsInStorage('accessSubjectTokens', visibleColumns);

        if (prevVisibleColumns?.length > visibleColumns?.length) {
            const filters = accessSubjectTokensFiltersSelector(getState());
            const colsDifference = prevVisibleColumns?.filter(col => !visibleColumns?.includes(col));

            const newFilters = resetFiltersByColumns(colsDifference, filters, 'name');

            dispatch(changeFilters(newFilters));
        }
    };
}

export function deleteAccessSubjectToken({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessSubjectTokens.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.accessSubjectTokenUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('tokens-page:Tag has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessSubjectTokenUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('tokens-page:Tag hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

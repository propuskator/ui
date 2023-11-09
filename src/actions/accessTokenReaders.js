import api                          from 'ApiSingleton';
import {
    accessTokenReadersFiltersSelector,
    accessTokenReadersListSelector,
    accessTokenReadersVisibleColumnsSelector
}                                   from 'Selectors/accessTokenReaders';
import { addToast }                 from 'Actions/toasts';
import { TOASTS_KEYS }              from 'Constants/toasts';
import i18n                         from 'I18next';
import {
    resetFiltersByColumns,
    setTableColumnsInStorage
}                                   from 'Utils/tables';

export const FETCH_ACCESS_TOKEN_READERS_REQUEST  = 'FETCH_ACCESS_TOKEN_READERS_REQUEST';
export const FETCH_ACCESS_TOKEN_READERS_SUCCESS  = 'FETCH_ACCESS_TOKEN_READERS_SUCCESS';
export const FETCH_ACCESS_TOKEN_READERS_ERROR    = 'FETCH_ACCESS_TOKEN_READERS_ERROR';
export const UPDATE_ACCESS_TOKEN_READER_SUCCESS  = 'UPDATE_ACCESS_TOKEN_READER_SUCCESS';
export const UPDATE_ACCESS_TOKEN_READERS_FILTER  = 'UPDATE_ACCESS_TOKEN_READERS_FILTER';
export const UPDATE_ACCESS_TOKEN_READERS_COLUMNS = 'UPDATE_ACCESS_TOKEN_READERS_COLUMNS';
export const UPDATE_ACCESS_READER_DISPLAYED_TOKENS_SUCCESS = 'UPDATE_ACCESS_READER_DISPLAYED_TOKENS_SUCCESS';
export const UPDATE_ACCESS_READER_DISPLAYED_TOKENS_ERROR   = 'UPDATE_ACCESS_READER_DISPLAYED_TOKENS_ERROR';

function dumpAccessTokenReader(data) {
    return data;
}

export function fetchAccessTokenReaders(params, list, syncWithRedux = true) {
    return async (dispatch, getState) => {
        if (syncWithRedux) {
            dispatch({ type: FETCH_ACCESS_TOKEN_READERS_REQUEST });
        }
        try {
            const state = getState();
            const requestParams = params ? params : accessTokenReadersFiltersSelector(state);
            const { isMergeList = false, ...restParams } = requestParams;
            const { data = [], meta } = await api.accessTokenReaders.list(restParams);

            let dataToSet = data;

            if (isMergeList) {
                const initialList = list ? list : (accessTokenReadersListSelector(state) || []);
                const initialWithoutDuplicates = initialList.filter(item =>
                    !data.find(entity => entity.id === item.id));

                dataToSet = [ ...initialWithoutDuplicates, ...data ];
            }
            if (syncWithRedux) {
                dispatch({
                    type    : FETCH_ACCESS_TOKEN_READERS_SUCCESS,
                    payload : {
                        data : dataToSet.map(dumpAccessTokenReader),
                        meta
                    }
                });
            }

            return { data: dataToSet, meta };
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_ACCESS_TOKEN_READERS_ERROR });
        }
    };
}

export function fetchAccessTokenReadersPhones() {
    return async () => {
        try {
            const { data = [] } = await api.accessTokenReaders.listPhoneNumbers();

            return data;
        } catch (error) {
            console.error({ error });
        }
    };
}

export const CREATE_ACCESS_POINT = 'CREATE_ACCESS_POINT';

export function createAccessTokenReader(accessPoint) {
    return async dispatch => {
        try {
            const response = await api.accessTokenReaders.create(accessPoint);

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_TOKEN_READERS_ERROR });

            throw error;
        }
    };
}

export function updateAccessTokenReader({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessTokenReaders.edit(id, data);

            dispatch({
                type    : UPDATE_ACCESS_TOKEN_READER_SUCCESS,
                payload : {
                    id,
                    accessTokenReader : dumpAccessTokenReader(response.data)
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_TOKEN_READERS_ERROR });

            throw error;
        }
    };
}

export function addDisplayedTopic({ topic, accessTokenReaderId } = {}) {
    return async dispatch => {
        try {
            const { data } = await api.accessTokenReaders.addDisplayedTopic({ topic, accessTokenReaderId });

            dispatch({
                type    : UPDATE_ACCESS_READER_DISPLAYED_TOKENS_SUCCESS,
                payload : {
                    displayedTopics : data?.displayedTopics,
                    accessTokenReaderId
                }
            });

            return data;
        } catch (error) {
            dispatch({ type: UPDATE_ACCESS_READER_DISPLAYED_TOKENS_ERROR });

            throw error;
        }
    };
}

export function deleteDisplayedTopic({ topic, accessTokenReaderId } = {}) {
    return async dispatch => {
        try {
            const { data } = await api.accessTokenReaders.deleteDisplayedTopic({ topic, accessTokenReaderId });

            dispatch({
                type    : UPDATE_ACCESS_READER_DISPLAYED_TOKENS_SUCCESS,
                payload : {
                    displayedTopics : data?.displayedTopics,
                    accessTokenReaderId
                }
            });

            return data;
        } catch (error) {
            dispatch({ type: UPDATE_ACCESS_READER_DISPLAYED_TOKENS_ERROR });

            throw error;
        }
    };
}

export function changeFilters(filters) {
    return {
        type    : UPDATE_ACCESS_TOKEN_READERS_FILTER,
        payload : {
            filters
        }
    };
}

export function setVisibleColumns(visibleColumns = []) {
    return (dispatch, getState) => {
        const prevVisibleColumns = accessTokenReadersVisibleColumnsSelector(getState());

        dispatch({ type: UPDATE_ACCESS_TOKEN_READERS_COLUMNS, payload: { visibleColumns } });
        setTableColumnsInStorage('accessTokenReaders', visibleColumns);

        if (prevVisibleColumns?.length > visibleColumns?.length) {
            const filters = accessTokenReadersFiltersSelector(getState());
            const colsDifference = prevVisibleColumns?.filter(col => !visibleColumns?.includes(col));

            const newFilters = resetFiltersByColumns(colsDifference, filters, 'name');

            dispatch(changeFilters(newFilters));
        }
    };
}

export function deleteAccessTokenReader({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessTokenReaders.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.accessTokenReaderUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('readers-page:Access point has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessTokenReaderUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('readers-page:Access point hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

import api       from 'ApiSingleton';

export const FETCH_API_SETTINGS_REQUEST = 'FETCH_API_SETTINGS_REQUEST';
export const FETCH_API_SETTINGS_SUCCESS = 'FETCH_API_SETTINGS_SUCCESS';
export const FETCH_API_SETTINGS_ERROR   = 'FETCH_API_SETTINGS_ERROR';

export const REFRESH_API_SETTINGS_REQUEST = 'REFRESH_API_SETTINGS_REQUEST';
export const REFRESH_API_SETTINGS_SUCCESS = 'REFRESH_API_SETTINGS_SUCCESS';
export const REFRESH_API_SETTINGS_ERROR   = 'REFRESH_API_SETTINGS_ERROR';

export function fetchApiSettings() {
    return async (dispatch) => {
        dispatch({ type: FETCH_API_SETTINGS_REQUEST });

        try {
            const { data } = await api.apiSettings.getData();

            dispatch({
                type    : FETCH_API_SETTINGS_SUCCESS,
                payload : { data }
            });

            return data;
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_API_SETTINGS_ERROR });
        }
    };
}

export function refreshApiSettings() {
    return async (dispatch) => {
        dispatch({ type: REFRESH_API_SETTINGS_REQUEST });

        try {
            const { data } = await api.apiSettings.refresh();

            dispatch({
                type    : REFRESH_API_SETTINGS_SUCCESS,
                payload : { data }
            });

            return data;
        } catch (error) {
            dispatch({ type: REFRESH_API_SETTINGS_ERROR });

            throw error;
        }
    };
}

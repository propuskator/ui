import api      from 'ApiSingleton';

export const FETCH_WORKSPACE_SETTINGS_REQUEST   = 'FETCH_WORKSPACE_SETTINGS_REQUEST';
export const FETCH_WORKSPACE_SETTINGS_SUCCESS   = 'FETCH_WORKSPACE_SETTINGS_SUCCESS';
export const FETCH_WORKSPACE_SETTINGS_ERROR     = 'FETCH_WORKSPACE_SETTINGS_ERROR';

export const UPDATE_WORKSPACE_SETTINGS_REQUEST  = 'UPDATE_WORKSPACE_SETTINGS_REQUEST';
export const UPDATE_WORKSPACE_SETTINGS_SUCCESS  = 'UPDATE_WORKSPACE_SETTINGS_SUCCESS';
export const UPDATE_WORKSPACE_SETTINGS_ERROR    = 'UPDATE_WORKSPACE_SETTINGS_ERROR';

export function fetchWorkspaceSettings() {
    return async dispatch => {
        dispatch({ type: FETCH_WORKSPACE_SETTINGS_REQUEST });

        const { data } = await api.workspace.getSettings();

        try {
            dispatch({
                type    : FETCH_WORKSPACE_SETTINGS_SUCCESS,
                payload : data
            });
        } catch (error) {
            dispatch({ type: FETCH_WORKSPACE_SETTINGS_ERROR });
        }
    };
}

export function updateWorkspaceSettings(settingsData) {
    return async dispatch => {
        dispatch({ type: UPDATE_WORKSPACE_SETTINGS_REQUEST });

        try {
            const { data } = await api.workspace.patchSettings(settingsData);

            dispatch({
                type    : UPDATE_WORKSPACE_SETTINGS_SUCCESS,
                payload : data
            });

            return data;
        } catch (error) {
            dispatch({ type: UPDATE_WORKSPACE_SETTINGS_ERROR });

            throw error;
        }
    };
}

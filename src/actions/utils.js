import api                      from 'ApiSingleton';


export const CONVERT_CSV_TO_JSON_REQUEST      = 'CONVERT_CSV_TO_JSON_REQUEST';
export const CONVERT_CSV_TO_JSON_SUCCESS      = 'CONVERT_CSV_TO_JSON_SUCCESS';
export const CONVERT_CSV_TO_JSON_ERROR        = 'CONVERT_CSV_TO_JSON_ERROR';

export function convertCsvToJson(formData) {
    return async (dispatch) => {
        dispatch({ type: CONVERT_CSV_TO_JSON_REQUEST });

        try {
            const { data } = await api.utils.convertCsvToJson(formData);

            dispatch({ type: CONVERT_CSV_TO_JSON_SUCCESS });

            return data;
        } catch (error) {
            dispatch({ type: CONVERT_CSV_TO_JSON_ERROR });
            throw error;
        }
    };
}

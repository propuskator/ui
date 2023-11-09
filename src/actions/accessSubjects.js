import {
    getFormData
}                                  from 'templater-ui/src/utils/formData';
import api                         from 'ApiSingleton';
import { formatDate }              from 'Utils/date';
import {
    accessSubjectsFiltersSelector,
    accessSubjectsListSelector,
    accessSubjectsVisibleColumnsSelector
}                              from 'Selectors/accessSubjects';
import {
    workspaceTimezoneSelector
}                              from 'Selectors/workspace';
import { addToast }            from 'Actions/toasts';
import { TOASTS_KEYS }         from 'Constants/toasts';
import i18n                    from 'I18next';
import {
    resetFiltersByColumns,
    setTableColumnsInStorage
}                              from 'Utils/tables';

export const FETCH_ACCESS_SUBJECTS_REQUEST  = 'FETCH_ACCESS_SUBJECTS_REQUEST';
export const FETCH_ACCESS_SUBJECTS_SUCCESS  = 'FETCH_ACCESS_SUBJECTS_SUCCESS';
export const FETCH_ACCESS_SUBJECTS_ERROR    = 'FETCH_ACCESS_SUBJECTS_ERROR';
export const UPDATE_ACCESS_SUBJECT_SUCCESS  = 'UPDATE_ACCESS_SUBJECT_SUCCESS';
export const UPDATE_ACCESS_SUBJECTS_FILTER  = 'UPDATE_ACCESS_SUBJECTS_FILTER';
export const UPDATE_ACCESS_SUBJECTS_COLUMNS = 'UPDATE_ACCESS_SUBJECTS_COLUMNS';

export const START_LOADING_SUBJECTS_CSV = 'START_LOADING_SUBJECTS_CSV';
export const END_LOADING_SUBJECTS_CSV   = 'END_LOADING_SUBJECTS_CSV';


function dumpAccessSubject(data) {
    return data;
}

export function fetchAccessSubjects(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ACCESS_SUBJECTS_REQUEST });

        try {
            const state = getState();
            const requestParams = params ? params : accessSubjectsFiltersSelector(state);
            const { isMergeList = false, ...restParams } = requestParams;
            const { data, meta } = await api.accessSubjects.list(restParams);

            let dataToSet = data;

            if (isMergeList) {
                const initialList = (accessSubjectsListSelector(state) || []);
                const initialWithoutDuplicates = initialList.filter(item =>
                    !data.find(entity => entity.id === item.id));

                dataToSet = [ ...initialWithoutDuplicates, ...data ];
            }

            dispatch({
                type    : FETCH_ACCESS_SUBJECTS_SUCCESS,
                payload : {
                    data : dataToSet.map(dumpAccessSubject),
                    meta
                }
            });

            return { data: dataToSet, meta };
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_ACCESS_SUBJECTS_ERROR });
        }
    };
}

export function fetchAccessSubjectsCsv() {
    return async (dispatch, getState) => {
        dispatch({ type: START_LOADING_SUBJECTS_CSV });

        try {
            const state = getState();
            const timezone = workspaceTimezoneSelector(state);
            const content = await api.accessSubjects.exportCsv();

            const a = document.createElement('a');
            const currentDate = formatDate({ date: new Date(), format: 'DD.MM.YY_HH:mm', timezone });

            a.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(content)}`);

            a.download = `${i18n.t('Subjects')}_${currentDate}.csv`;

            a.click();
        } catch (error) {
            console.error({ error });

            dispatch(addToast({
                key     : TOASTS_KEYS.csvAccessSubjects,
                title   : i18n.t('toasts:Something went wrong'),
                message : i18n.t('toasts:Failed to generate csv file "Subjects"'),
                type    : 'error'
            }));
        } finally {
            dispatch({ type: END_LOADING_SUBJECTS_CSV });
        }
    };
}

export const CREATE_SUBJECT = 'CREATE_SUBJECT';

export function createAccessSubject(data, isCreatingOnRequest = false) {
    return async dispatch => {
        try {
            const keys = [
                { key: 'avatarImg', asKey: 'avatarImg' },
                { key: 'name', asKey: 'name' },
                { key: 'phone', asKey: 'phone' },
                { key: 'email', asKey: 'email' },
                { key: 'phoneEnabled', asKey: 'phoneEnabled' },
                { key: 'mobileEnabled', asKey: 'mobileEnabled' },
                { key: 'canAttachTokens', asKey: 'canAttachTokens' },
                { key: 'position', asKey: 'position' },
                { key: 'accessSubjectTokenIds', asKey: 'accessSubjectTokenIds' },
                { key: 'sendInvitation', asKey: 'sendInvitation' }
            ];

            const formData = getFormData(data, keys);
            const response = isCreatingOnRequest
                ? await api.accessSubjects.createOnRequest(formData)
                : await api.accessSubjects.create(formData);

            return { ...response?.data, ...response?.meta };
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SUBJECTS_ERROR });

            throw error;
        }
    };
}


export function updateAccessSubject({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const keys = [
                { key: 'avatarImg', asKey: 'avatarImg' },
                { key: 'name', asKey: 'name' },
                { key: 'phone', asKey: 'phone' },
                { key: 'email', asKey: 'email' },
                { key: 'phoneEnabled', asKey: 'phoneEnabled' },
                { key: 'mobileEnabled', asKey: 'mobileEnabled' },
                { key: 'canAttachTokens', asKey: 'canAttachTokens' },
                { key: 'position', asKey: 'position' },
                { key: 'accessSubjectTokenIds', asKey: 'accessSubjectTokenIds' },
                { key: 'isArchived', asKey: 'isArchived' },
                { key: 'enabled', asKey: 'enabled' }
            ];

            const formData = getFormData(data, keys);
            const response = await api.accessSubjects.edit(id, formData);

            dispatch({
                type    : UPDATE_ACCESS_SUBJECT_SUCCESS,
                payload : {
                    id,
                    accessSubject : dumpAccessSubject(response.data)
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SUBJECTS_ERROR });

            throw error;
        }
    };
}


export function patchAccessSubject({ id, ...data } = {}) {
    return async dispatch => {
        try {
            const response = await api.accessSubjects.patch(id, data);

            dispatch({
                type    : UPDATE_ACCESS_SUBJECT_SUCCESS,
                payload : {
                    id,
                    subject : dumpAccessSubject(response.data)
                }
            });

            return response.data;
        } catch (error) {
            dispatch({ type: FETCH_ACCESS_SUBJECTS_ERROR });

            throw error;
        }
    };
}

export function changeFilters(filters) {
    return {
        type    : UPDATE_ACCESS_SUBJECTS_FILTER,
        payload : {
            filters
        }
    };
}

export function setVisibleColumns(visibleColumns = []) {
    return (dispatch, getState) => {
        const prevVisibleColumns = accessSubjectsVisibleColumnsSelector(getState());

        dispatch({ type: UPDATE_ACCESS_SUBJECTS_COLUMNS, payload: { visibleColumns } });
        setTableColumnsInStorage('accessSubjects', visibleColumns);

        if (prevVisibleColumns?.length > visibleColumns?.length) {
            const filters = accessSubjectsFiltersSelector(getState());
            const colsDifference = prevVisibleColumns?.filter(col => !visibleColumns?.includes(col));

            const newFilters = resetFiltersByColumns(colsDifference, filters, 'name');

            dispatch(changeFilters(newFilters));
        }
    };
}

export function deleteAccessSubject({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessSubjects.delete(id);

            // dispatch(addToast({
            //     key     : TOASTS_KEYS.accessSubjectUpdate,
            //     title   : i18n.t('Action was completed successfully'),
            //     message : i18n.t('subjects-page:Subject has been deleted'),
            //     type    : 'success'
            // }));
        } catch (error) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessSubjectUpdate,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('subjects-page:Subject hasn\'t been deleted'),
                type    : 'error'
            }));

            throw error;
        }
    };
}

export function inviteAccessSubject({ id } = {}) {
    return async dispatch => {
        try {
            if (!id) return;

            await api.accessSubjects.invite(id);

            dispatch(addToast({
                key     : TOASTS_KEYS.accessSubjectInvite,
                title   : i18n.t('Action was completed successfully'),
                message : i18n.t('subjects-page:Subject has been invited'),
                type    : 'success'
            }));
        } catch (e) {
            dispatch(addToast({
                key     : TOASTS_KEYS.accessSubjectInvite,
                title   : i18n.t('Something went wrong'),
                message : i18n.t('subjects-page:Subject hasn\'t been invited'),
                type    : 'error'
            }));
        }
    };
}

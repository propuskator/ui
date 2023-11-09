import api                         from 'ApiSingleton';
import { formatDate }              from 'Utils/date';
import { TOASTS_KEYS }             from 'Constants/toasts';
import { addToast }                from 'Actions/toasts';
import {
    accessLogsFiltersSelector
}                                  from 'Selectors/accessLogs';
import {
    workspaceTimezoneSelector
}                                  from 'Selectors/workspace';

import i18n                        from 'I18next';

export const FETCH_ACCESS_LOGS_REQUEST = 'FETCH_ACCESS_LOGS_REQUEST';
export const FETCH_ACCESS_LOGS_SUCCESS = 'FETCH_ACCESS_LOGS_SUCCESS';
export const FETCH_ACCESS_LOGS_ERROR   = 'FETCH_ACCESS_LOGS_ERROR';
export const UPDATE_ACCESS_LOGS_FILTER = 'UPDATEACCESS_LOGS_FILTER';

export const START_LOADING_ACCESS_LOGS_CSV = 'START_LOADING_ACCESS_LOGS_CSV';
export const END_LOADING_ACCESS_LOGS_CSV   = 'END_LOADING_ACCESS_LOGS_CSV';


function dumpAccessLog(data) {
    return data;
}

export function fetchAccessLogs(params) {
    return async (dispatch, getState) => {
        dispatch({ type: FETCH_ACCESS_LOGS_REQUEST });

        try {
            const requestParams = params ? params : accessLogsFiltersSelector(getState());

            const { data, meta } = await api.accessLogs.list(requestParams);

            dispatch({
                type    : FETCH_ACCESS_LOGS_SUCCESS,
                payload : {
                    data : data.map(dumpAccessLog),
                    meta
                }
            });
        } catch (error) {
            console.error({ error });

            dispatch({ type: FETCH_ACCESS_LOGS_ERROR });
        }
    };
}

export function fetchAccessLogsCsv() {
    return async (dispatch, getState) => {
        dispatch({ type: START_LOADING_ACCESS_LOGS_CSV });

        try {
            const state = getState();
            const requestParams = {
                ...(accessLogsFiltersSelector(state) || {}),
                limit  : void 0,
                offset : 0
            };
            const timezone = workspaceTimezoneSelector(state);

            const { data } = await api.accessLogs.list(requestParams);

            const tableHeaderCells = [
                i18n.t('Subject'),
                i18n.t('Tag'),
                i18n.t('Access point'),
                i18n.t('Status'),
                i18n.t('access-logs-page:Time')
            ];

            const STATUSSES_BY_CODE = {
                DENIED    : 'Access denied',
                SUCCESS   : 'Success',
                ALARM_ON  : 'Alarm activated',
                ALARM_OFF : 'Alarm deactivated'
            };

            const TOKEN_BY_TYPE = {
                SUBJECT : 'Mobile device',
                PHONE   : 'Phone call',
                BUTTON  : 'Exit button'
            };

            const tableRows = data?.map(accessLog => ([
                accessLog?.accessSubject?.name || '',
                accessLog?.accessSubjectToken?.name || getAccessToken(accessLog) || '',
                accessLog?.accessTokenReader?.name || '',
                i18n.t(`access-logs-page:${STATUSSES_BY_CODE[accessLog?.status]}`),
                formatDate({ date: accessLog?.attemptedAt, format: 'DD.MM.YY HH:mm', timezone }) || ''
            ])) || [];

            function getAccessToken(accessLog) { // eslint-disable-line no-inner-declarations
                if ([ 'ALARM_ON', 'ALARM_OFF' ].includes(accessLog?.status)) return i18n.t('access-logs-page:Alarm');

                return i18n.t(`access-logs-page:${TOKEN_BY_TYPE[accessLog?.initiatorType]}`) || '';
            }

            function createExportHeader(cells, separator) {    // eslint-disable-line no-inner-declarations
                let headerRow = '';
                const newLine = '\r\n';

                cells.forEach((cell, cellIndex) => {
                    headerRow += (cellIndex > 0 ? separator : '') + cell;
                });

                return headerRow + newLine;
            }

            function createExportRows(rows, separator) {    // eslint-disable-line no-inner-declarations
                let content = '';
                const newLine = '\r\n';

                rows.forEach(row => {
                    row.forEach((cellData, cellIndex) => {
                        content += (cellIndex > 0 ? separator : '') + cellData;
                    });

                    content += newLine;
                });

                return content;
            }

            const separator = ',';

            let content = createExportHeader(tableHeaderCells, separator);

            content += createExportRows(tableRows, separator);

            const a = document.createElement('a');
            const currentDate = formatDate({ date: new Date(), format: 'DD.MM.YY_HH:mm', timezone });

            a.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(content)}`);

            a.download = `${i18n.t('access-logs-page:Access logs')?.split(' ').join('_')}_${currentDate}.csv`;

            a.click();
        } catch (error) {
            console.error({ error });

            dispatch(addToast({
                key     : TOASTS_KEYS.csvAccessLogs,
                title   : i18n.t('toasts:Something went wrong'),
                message : i18n.t('toasts:Failed to generate csv file "Access Log"'),
                type    : 'error'
            }));
        } finally {
            dispatch({ type: END_LOADING_ACCESS_LOGS_CSV });
        }
    };
}

export function changeFilters(filters) {
    return {
        type    : UPDATE_ACCESS_LOGS_FILTER,
        payload : {
            filters
        }
    };
}

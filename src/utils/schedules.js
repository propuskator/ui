/* eslint-disable babel/no-unused-expressions */
import {
    formatDate
}                               from 'Utils/date';
import i18n                     from 'I18next';


export function checkIsScheduleRepeated(schedule) {
    return schedule.repeatType !== 'NO_REPEAT';
}

export function getFormattedScheduleByDate({
    scheduleData = {}, timezone
} = {}) { // eslint-disable-line max-lines-per-function,
    const {
        weekBitMask,
        dailyIntervalStart, dailyIntervalEnd,
        from: fromValue, to: toValue
    } = scheduleData;

    const withoutAccessText = `❌ ${i18n.t('schedules-page:Without access')}`;

    const MAX_DAILY_END = 86340000;
    const MIN_DAILY_END = 0;
    const AVAILABLE_WEEK_DAYS = 7;
    const isPeriodExist = (fromValue || fromValue === 0) && toValue;
    const isAllDays =  weekBitMask?.filter(i => i === 1)?.length === AVAILABLE_WEEK_DAYS;
    const isMaxDailyInterval = dailyIntervalStart === MIN_DAILY_END && dailyIntervalEnd === MAX_DAILY_END;

    const withoutAccess = weekBitMask ? !weekBitMask?.includes(1) : false;

    if (withoutAccess) return withoutAccessText;

    const isFulltimeAccess = !isPeriodExist && isAllDays && isMaxDailyInterval;

    if (isFulltimeAccess) return `⏱ ${i18n.t('schedules-page:Unlimited access')}`;

    const isFulltimeInPeriod = isPeriodExist && isAllDays && isMaxDailyInterval;
    const isFullDailyInPeriod = isPeriodExist && !isAllDays && isMaxDailyInterval;

    const isWeekDaysExist = !!weekBitMask?.filter(item => item === 1)?.length || false;

    let formattedString = '';

    if (isWeekDaysExist && !isFulltimeInPeriod && !isAllDays) {
        const WEEK_DAYS = [
            i18n.t('schedules-page:mon.'),
            i18n.t('schedules-page:tue.'),
            i18n.t('schedules-page:wed.'),
            i18n.t('schedules-page:th.'),
            i18n.t('schedules-page:fri.'),
            i18n.t('schedules-page:sat.'),
            i18n.t('schedules-page:sun.')
        ];
        const diapasonsList = [];

        const diapasonData = {
            start : 0,
            end   : 0
        };

        weekBitMask?.forEach((item, index) => {
            if (item === 1) {
                const isLast = index === weekBitMask?.length - 1;

                if (isLast) {
                    diapasonData.end = index;

                    diapasonsList.push({ ...diapasonData });
                } else diapasonData.end = index;
            } else {
                if (index > 0 && diapasonData.start <= diapasonData.end) diapasonsList.push({ ...diapasonData });

                diapasonData.start = index + 1;
            }
        });

        if (diapasonsList?.length) {
            formattedString += '🗓 ';

            diapasonsList.forEach((diapason, index) => {
                const isLast = index === diapasonsList.length - 1;

                if ((diapason.start + 1) === diapason.end) {
                    formattedString += `${WEEK_DAYS[diapason.start]}, ${WEEK_DAYS[diapason.end]}${!isLast ? ', ' : ' '}`;
                } else if (diapason.start === diapason.end) {
                    formattedString += `${WEEK_DAYS[diapason.start]}${!isLast ? ', ' : ' '}`;
                } else {
                    formattedString += `${WEEK_DAYS[diapason.start]}-${WEEK_DAYS[diapason.end]}${!isLast ? ', ' : ' '}`;
                }


                if (isLast) formattedString += '\n';
            });
        }
    }

    if (!isFulltimeInPeriod && !isFullDailyInPeriod && !isMaxDailyInterval
            && (
                (dailyIntervalStart || dailyIntervalStart === 0)
                || (dailyIntervalEnd || dailyIntervalEnd === 0)
            )) {
        const startedDate = getFormattedDailyIntervalDate(dailyIntervalStart);
        const endedDate   = getFormattedDailyIntervalDate(dailyIntervalEnd);

        formattedString += `⌚️ ${startedDate} - ${endedDate}\n`;
    }

    if (fromValue && toValue) {
        const fromDate =  formatDate({ date: +fromValue, format: 'DD/MM/YYYY HH:mm', timezone });
        const toDate =  formatDate({ date: +toValue, format: 'DD/MM/YYYY HH:mm', timezone });

        formattedString += `📆 ${fromDate} - ${toDate}`;
    }

    return formattedString
        ? formattedString
        : withoutAccessText;
}

export function getFormattedSchedule(schedule = {}, timezone = '') {
    let result = '';
    const { dates = [] } = schedule;
    const datesLength = dates?.length;

    if (!datesLength) return '-';

    dates?.forEach((scheduleData) => {
        const schedulePart = getFormattedScheduleByDate({
            scheduleData,
            timezone
        });

        result += schedulePart;
    });

    return result;
}


export function getFormattedDailyIntervalDate(date) {
    if (!date && date !== 0) return '';
    const MS_IN_HOUR = 3600 * 1000; // eslint-disable-line no-magic-numbers
    const MS_IN_MINUTE = 60 * 1000; // eslint-disable-line no-magic-numbers

    const rawHours   = Math.round((date - (date % MS_IN_HOUR)) / MS_IN_HOUR);
    const rawMinutes = Math.round((date - rawHours * MS_IN_HOUR) / MS_IN_MINUTE);

    const hours   = rawHours > -1 ? rawHours : 0;   // eslint-disable-line no-magic-numbers
    const minutes = rawMinutes > -1 ? rawMinutes : 0;   // eslint-disable-line no-magic-numbers

    if ((hours || hours === 0) || (minutes || minutes === 0)) {
        const LAST_2_CHARS = -2;
        const fullHours  = `00${hours}`.slice(LAST_2_CHARS);
        const fulMinutes = `00${minutes}`.slice(LAST_2_CHARS);

        return `${fullHours}:${fulMinutes}`;
    }

    return '';
}

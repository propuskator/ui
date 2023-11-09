/* eslint-disable no-magic-numbers */
import moment                   from 'moment-timezone';

import { TIMEZONES_LIST }       from 'templater-ui/src/constants/timezones';

import i18n                     from 'I18next';

export function formatDate({ date, format = 'DD.MM.YY HH:mm:ss', timezone }) {
    if (!timezone) return moment(date).format(format);
    const dateWithTimezone = getDateWithTimezone({ date, timezone });

    return moment(dateWithTimezone).format(format);
}

export function getDateWithTimezone({ date, timezone }) {
    if (!timezone || !date) return date;
    const timeZone = getUtcBySelectedTimezone(timezone);

    return moment(date).tz(timeZone);
}

function plural(word, num) {
    const forms = word.split('_');

    // TODO: remove magic numbers
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4  // eslint-disable-line
        && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);  // eslint-disable-line
}

export function relativeTimeWithPlural(number, withoutSuffix, key, lang) {
    if (lang === 'ru') return relativeRu(number, withoutSuffix, key);
    if (lang === 'uk') return relativeUa(number, withoutSuffix, key);

    return relativeEn(number, withoutSuffix, key);
}

function relativeEn(number, withoutSuffix, key) {
    const format = {
        'ss' : withoutSuffix ? 'second_seconds_seconds' : 'second_seconds_seconds',
        'mm' : withoutSuffix ? 'minute_minutes_minutes' : 'minute_minutes_minutes',
        'hh' : 'hour_hours_hours',
        'dd' : 'day_days_days',
        'MM' : 'month_months_months',
        'yy' : 'year_years_years'
    };

    if (key === 'm') {
        return withoutSuffix ? 'minute' : 'minutes';
    }

    return `${number  } ${  plural(format[key], +number)} ago`;
}

function relativeRu(number, withoutSuffix, key) {
    const format = {
        'ss' : withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
        'mm' : withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
        'hh' : 'час_часа_часов',
        'dd' : 'день_дня_дней',
        'MM' : 'месяц_месяца_месяцев',
        'yy' : 'год_года_лет'
    };

    if (key === 'm') {
        return withoutSuffix ? 'минута' : 'минуту';
    }

    return `${number  } ${  plural(format[key], +number)} назад`;
}

function relativeUa(number, withoutSuffix, key) {
    const format = {
        'ss' : withoutSuffix ? 'секунда_секунди_секунд' : 'секунду_секунди_секунд',
        'mm' : withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
        'hh' : 'година_години_годин',
        'dd' : 'день_дня_днів',
        'MM' : 'місяць_місяця_місяців',
        'yy' : 'рік_роки_років'
    };

    if (key === 'm') {
        return withoutSuffix ? 'хвилина' : 'хвилину';
    }

    return `${number  } ${  plural(format[key], +number)} назад`;
}

export function getRelativeTime(time, { timezone } = {}) {
    const lang = i18n.language;
    const currentDateWithTimezone = timezone
        ? getDateWithTimezone({ date: new Date(), timezone })
        : new Date();
    const dateWithTimezone = timezone
        ? getDateWithTimezone({ date: time, timezone })
        : time;

    const msInSecond = 1000;

    const unixDate = moment(dateWithTimezone, 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ').unix() * msInSecond;
    const differenceInSeconds = Math.round((currentDateWithTimezone - new Date(unixDate)) / msInSecond);

    if (differenceInSeconds < 60) {
        if (lang === 'ru') return 'Только что';
        if (lang === 'uk') return 'Щойно';

        return 'Just now';
    }

    const minutes = Math.round(differenceInSeconds / 60);

    if (minutes < 60) {
        return relativeTimeWithPlural(minutes, true, 'mm', lang);
    }

    const hours = Math.round(minutes / 60);
    const hoursInDay = 24;

    if (hours < hoursInDay && hours > 0) {
        return relativeTimeWithPlural(hours, true, 'hh', lang);
    }

    return formatDate({ date: dateWithTimezone, format: 'DD.MM.YY HH:mm' });
}

export function getValidDate({ year, month, day, hours, minutes } = {} /* format = 'dd/MM/yyyy HH:MM' */) {
    const LAST_2_CHARS = -2;
    const dateToFormat = new Date();
    const fullFilledHours  = hours ? `00${hours}`.slice(LAST_2_CHARS) : '00';
    const fulfilledMinutes = minutes ? `00${minutes}`.slice(LAST_2_CHARS) : '00';

    const monthToSet = +month - 1;

    dateToFormat.setDate(+day);
    dateToFormat.setMonth(monthToSet);
    dateToFormat.setFullYear(+year);

    if (dateToFormat.getFullYear() !== +year) return;
    if (dateToFormat.getDate() !== +day) return;
    if (dateToFormat.getMonth() !== monthToSet) return;

    dateToFormat.setHours(+fullFilledHours);
    if (dateToFormat.getHours() !== +fullFilledHours) return;

    dateToFormat.setMinutes(+fulfilledMinutes);
    if (dateToFormat.getMinutes() !== +fulfilledMinutes) return;

    const isValid = isValidDate(dateToFormat);

    if (!isValid) return;

    return dateToFormat;

    // moment works incorrect
    // const momentDate = moment(`${day}/${month}/${year} ${fullFilledHours}:${fulfilledMinutes}`, format, true);

    // if (!momentDate._isValid) return;

    // return moment().valueOf();
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

export function getCurrentTimezone() {
    const utcCode = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (!utcCode) return;

    return TIMEZONES_LIST.find(timeZone => timeZone?.utc?.includes(utcCode))?.text;
}

export function getUtcBySelectedTimezone(selected) {
    const timezoneData = selected
        ? TIMEZONES_LIST?.find(item => item?.text === selected)
        : void 0;

    return timezoneData?.utc[0] || Intl.DateTimeFormat().resolvedOptions().timeZone;
}

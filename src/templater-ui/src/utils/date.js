/* eslint-disable no-magic-numbers */
import moment                   from 'moment';

export function formatDate({ date, format = 'DD.MM.YY HH:mm:ss' }) {
    return moment(date).format(format);
}

function plural(word, num) {
    const forms = word.split('_');

    // TODO: remove magic numbers
    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4  // eslint-disable-line
        && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);  // eslint-disable-line
}

export function relativeTimeWithPlural(number, withoutSuffix, key, lang) {
    if (lang === 'ru') return relativeRu(number, withoutSuffix, key);

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


export function getRelativeTime(time, lang, format) {
    const msInSecond = 1000;

    const unixDate = moment(time, 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ').unix() * msInSecond;
    const differenceInSeconds = Math.round((new Date() - new Date(unixDate)) / msInSecond);

    if (differenceInSeconds < 60) {
        if (lang === 'ru') return 'Только что';

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

    const longDate = moment(time, 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ').format(format || 'DD.MM.YY HH:mm');

    return longDate;
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


export function getFullDate(rowDate, { format =  'DD/MM/YYYY' } = {}) {  // because moment works incorrect
    const date = new Date(rowDate);
    const formattedFirstPart = formatDate({ date, format });
    const minutes = date.getMinutes();
    const hours   = date.getHours();

    const LAST_2_CHARS = -2;

    const fullFileedMinutes = minutes ? `00${minutes}`.slice(LAST_2_CHARS) : '00';
    const fullfiledHours =  hours ? `00${hours}`.slice(LAST_2_CHARS) : '00';

    return `${formattedFirstPart} ${fullfiledHours}:${fullFileedMinutes}`;
}

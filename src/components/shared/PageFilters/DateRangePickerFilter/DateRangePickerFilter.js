import React, {
    useState,
    useEffect,
    useCallback
}                                     from 'react';
import PropTypes                      from 'prop-types';
import classnames                     from 'classnames/bind';
import moment                         from 'moment';
import { MuiPickersUtilsProvider }    from '@material-ui/pickers';
import DateFnsUtils                   from '@date-io/date-fns';
import format                         from 'date-fns/format';
import ruLocale                       from 'date-fns/locale/ru';
import uaLocale                       from 'date-fns/locale/uk';

import IconButton                     from 'templater-ui/src/components/base/IconButton';
import Link                           from 'templater-ui/src/components/base/Link';
import DateRangePicker                from 'templater-ui/src/components/shared/DateRangePicker';

import { getDateWithTimezone }        from 'Utils/date';

import styles                         from './DateRangePickerFilter.less';

const TIME_FORMAT = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ';

const cx = classnames.bind(styles);

class LocalizedUtils extends DateFnsUtils {
    getDatePickerHeaderText(date) {
        return format(date, 'cccccc, d MMMM', { locale: this.locale });
    }

    getCalendarHeaderText(date) {
        return format(date, 'LLLL yyyy', { locale: this.locale });
    }
}

const LOCALES_UTILS_BY_LANG = {
    ru : ruLocale,
    uk : uaLocale
};

function DareRangePickerFilter(props) {    /* eslint-disable-line max-lines-per-function */
    const { onChange, name, defaultValue, label, timezone, languageId, t } = props;
    const [ firstValue,  setFirstValue ]  = useState(defaultValue && defaultValue[0] ? defaultValue[0] : null);
    const [ secondValue, setSecondValue ] = useState(defaultValue && defaultValue[1] ? defaultValue[1] : null);
    const [ isOpen, setIsOpen ] = useState(false);

    useEffect(() => {
        if (firstValue && secondValue) {
            const beginWithTimezone = getDateWithTimezone({ date: firstValue, timezone });
            const endWithTimezone = getDateWithTimezone({ date: secondValue, timezone });

            const beginFormatted = moment(beginWithTimezone).format(TIME_FORMAT);
            const endFormatted   = moment(endWithTimezone).format(TIME_FORMAT);

            onChange({ name, value: [ beginFormatted, endFormatted ] });
        }
    }, [ firstValue, secondValue, timezone ]);

    function handleTodayTimeClick() {
        const dateWithTimezone = getDateWithTimezone({ date: new Date(), timezone });

        const today     = moment(dateWithTimezone).startOf('day');
        const tomorrow  = moment(dateWithTimezone).endOf('day');

        setFirstValue(today);
        setSecondValue(tomorrow);
    }

    function handleMonthTimeClick() {
        const dateWithTimezone = getDateWithTimezone({ date: new Date(), timezone });

        const startOfMonth = moment(dateWithTimezone).startOf('month');
        const endOfMonth   = moment(dateWithTimezone).endOf('month');

        setFirstValue(startOfMonth);
        setSecondValue(endOfMonth);
    }

    function formatDate(date) {
        return moment(date).format('DD.MM.YY');
    }

    function renderValue(begin, end) {
        if (begin && end) return `${formatDate(begin)} - ${formatDate(end)}`;

        return '';
    }

    function setTimezoneWithCorrectDate(rawDate) {
        const date  = moment(rawDate);
        const day   = date.format('D');
        const year  = date.format('YYYY');
        const month = date.format('M');

        const processDate = new Date(getDateWithTimezone({ date, timezone }));

        processDate.setFullYear(year);
        processDate.setMonth(month - 1);
        processDate.setDate(day);

        return processDate;
    }

    function handleTimeUpdate(valuesRange) {
        const startWithTimezone = setTimezoneWithCorrectDate(valuesRange.begin, timezone);
        const endWithTimezone = setTimezoneWithCorrectDate(valuesRange.end, timezone);

        const formattedStart = moment(startWithTimezone).startOf('day');
        const formattedEnd   = moment(endWithTimezone).endOf('day');

        const isStartChanged = +firstValue !== +formattedStart;
        const isEndChanged = +secondValue !== +formattedEnd;

        if (isStartChanged) setFirstValue(formattedStart);
        if (isEndChanged) setSecondValue(formattedEnd);
    }

    function cleanDate(e) {
        e.stopPropagation();
        setFirstValue(null);
        setSecondValue(null);

        onChange({ name, value: [ '', '' ] });
    }

    function handleInputClick() {
        setIsOpen(true);
    }

    const dateRangePickerFilterCN = cx(styles.DateRangePickerFilter, {
        open    : isOpen,
        focused : isOpen
    });
    const isSelected = firstValue && secondValue;

    return (
        <div className={dateRangePickerFilterCN}>
            <MuiPickersUtilsProvider utils={LocalizedUtils} locale={LOCALES_UTILS_BY_LANG[languageId]}>
                <div className={styles.datepickerWrapper}>
                    <DateRangePicker
                        placeholder = 'Select a date range'
                        onChange    = {handleTimeUpdate}
                        format      = 'yy.MM.d'
                        value       = {firstValue && secondValue
                            ? [ setTimezoneWithCorrectDate(firstValue), setTimezoneWithCorrectDate(secondValue) ]
                            : [ new Date(), new Date() ]
                        }
                        open        = {isOpen}
                        onOpen      = {useCallback(() => setIsOpen(true), [])}
                        onClose     = {useCallback(() => setIsOpen(false), [])}
                        languageId  = {languageId}
                        t           = {t}
                    />
                </div>
                <div className = {styles.calendar} onClick = {handleInputClick}>
                    { label
                        ? (
                            <p className={cx(styles.calendarLabel, { selected: isSelected })}>
                                { label }
                            </p>
                        ) : null
                    }
                    <p className={styles.value}>
                        {renderValue(firstValue, secondValue)}
                    </p>

                    <>
                        { firstValue && secondValue &&
                        <IconButton
                            onClick            = {cleanDate}
                            className          = {styles.clearIconButton}
                            disableFocusRipple = {false}
                            iconType           = 'cross'
                        />
                        }
                        <IconButton
                            onClick            = {useCallback(() => setIsOpen(true), [])}
                            className          = {styles.calendarIconButton}
                            iconType           = 'calendar'
                        />
                    </>
                </div>
                <div className={styles.subControls}>
                    <Link
                        className = {cx(styles.control)}
                        onClick   = {handleTodayTimeClick}
                        color     = 'primary'
                    >
                        {t('today')}
                    </Link>
                    <Link
                        className = {cx(styles.control)}
                        onClick   = {handleMonthTimeClick}
                        color     = 'primary'
                    >
                        {t('month')}
                    </Link>
                </div>
            </MuiPickersUtilsProvider>
        </div>
    );
}

DareRangePickerFilter.propTypes = {
    name         : PropTypes.string.isRequired,
    defaultValue : PropTypes.array,
    label        : PropTypes.string.isRequired,
    onChange     : PropTypes.func.isRequired,
    timezone     : PropTypes.string,
    languageId   : PropTypes.string,
    t            : PropTypes.func
};

DareRangePickerFilter.defaultProps = {
    defaultValue : void 0,
    timezone     : void 0,
    languageId   : void 0,
    t            : (text) => text
};

export default DareRangePickerFilter;

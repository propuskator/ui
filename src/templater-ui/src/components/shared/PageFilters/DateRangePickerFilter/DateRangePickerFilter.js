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

import Link                           from './../../../base/Link';
import IconButton                     from './../../../base/IconButton';
import DateRangePicker                from './../../../shared/DateRangePicker';

import styles                         from './DateRangePickerFilter.less';

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
    ru : ruLocale
};

function DareRangePickerFilter(props) {    /* eslint-disable-line max-lines-per-function */
    const { onChange, name, defaultValue, label, t, languageId } = props;
    const [ firstValue,  setFirstValue ]  = useState(() => {
        const offset = moment().utcOffset();

        return defaultValue && defaultValue[0]
            ? moment(defaultValue[0]).subtract(offset, 'm').toISOString()
            : null;
    });
    const [ secondValue, setSecondValue ] = useState(() => {
        const offset = moment().utcOffset();

        return defaultValue && defaultValue[1]
            ? moment(defaultValue[1]).subtract(offset, 'm').toISOString()
            : null;
    });
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isFocus, setIsFocus ] = useState(false);

    useEffect(() => {
        if (firstValue && secondValue) {
            const offset = moment().utcOffset();
            const beginFormatted = moment(firstValue).add(offset, 'm').toISOString();
            const endFormatted   = moment(secondValue).add(offset, 'm').toISOString();

            onChange({ name, value: [ beginFormatted, endFormatted ] });
        }
    }, [ firstValue, secondValue ]);

    function handleTodayTimeClick() {
        const today     = moment().startOf('day');
        const tomorrow  = moment().endOf('day');

        setFirstValue(today);
        setSecondValue(tomorrow);
    }

    function handleMonthTimeClick() {
        const startOfMonth = moment().startOf('month');
        const endOfMonth   = moment().endOf('month');

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

    function handleTimeUpdate(valuesRange) {
        const formattedStart = +new Date(moment(valuesRange.begin).startOf('day'));
        const formattedEnd   = +new Date(moment(valuesRange.end).endOf('day'));

        const isStartChanged = +firstValue !== formattedStart;
        const isEndChanged = +secondValue !== formattedEnd;

        if (isStartChanged) setFirstValue(new Date(formattedStart));

        if (isEndChanged) setSecondValue(new Date(formattedEnd));
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
        'open'        : isOpen,
        focusedButton : isFocus,
        focused       : isOpen
    });
    const isSelected = firstValue && secondValue;

    return (
        <div className={dateRangePickerFilterCN} key={languageId}>
            <MuiPickersUtilsProvider utils={LocalizedUtils} locale={LOCALES_UTILS_BY_LANG[languageId]}>
                <div className={styles.datepickerWrapper}>
                    <DateRangePicker
                        placeholder = 'Select a date range'
                        onChange    = {handleTimeUpdate}
                        format      = 'yy.MM.d'
                        value       = {firstValue && secondValue
                            ? [ new Date(firstValue), new Date(secondValue) ]
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
                            onClick   = {useCallback(() => setIsOpen(true), [])}
                            className = {styles.calendarIconButton}
                            iconType  = 'calendar'
                            iconButtonProps = {{
                                onFocus : () => setIsFocus(true),
                                onBlur  : () => setIsFocus(false)
                            }}
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
    languageId   : PropTypes.string,
    t            : PropTypes.func
};

DareRangePickerFilter.defaultProps = {
    defaultValue : void 0,
    languageId   : void 0,
    t            : (text) => text
};

export default DareRangePickerFilter;

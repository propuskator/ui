/* eslint-disable  no-shadow */
import React, {
    useState,
    useMemo,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import moment                   from 'moment-timezone';

import Typography               from 'templater-ui/src/components/base/Typography';
import InputDate                from 'templater-ui/src/components/base/Input/InputDate';
import IconButton               from 'templater-ui/src/components/base/IconButton';
import DateRangePicker          from 'templater-ui/src/components/shared/DateRangePicker';

import {
    getUtcBySelectedTimezone,
    formatDate
}                               from 'Utils/date';

import styles                   from './DateRange.less';

const cx = classnames.bind(styles);

const DATE_FORMAT_TO_SPLIT = 'DD:MM:YYYY:HH:mm:ss';

function DateRange(props) {    // eslint-disable-line  max-lines-per-function
    const {
        onChange,
        isProcessing,
        errors,
        fields,
        timezone,
        languageId,
        t
    } = props;

    const [ isCalendarOpen, setIsCalendarOpen ] = useState(false);

    function handleChange({ name, value } = {}) {
        const processValue = replaceDateTimezone(value, timezone, true);

        onChange({ name, value: +processValue });
    }

    function replaceDateTimezone(rawDate, timezone, changeTime) {
        if (!rawDate) return rawDate;

        const timeZone = getUtcBySelectedTimezone(timezone);

        return moment(rawDate).tz(timeZone, changeTime);
    }

    function getSameTimeWithCurrentTimezone(rawDate, isFormatted = false) {
        if (!rawDate) return rawDate;

        const formatted = !isFormatted
            ? formatDate({ date: moment(rawDate), format: DATE_FORMAT_TO_SPLIT })
            : rawDate;

        const dateParts = formatted?.split(':')?.map(el => +el);

        const [ day, month, year, hours, minutes, seconds ] = dateParts;

        const processDate = new Date();

        processDate.setFullYear(year);
        processDate.setMonth(month - 1);
        processDate.setDate(day);

        processDate.setHours(hours);
        processDate.setMinutes(minutes);
        processDate.setSeconds(seconds);

        return processDate;
    }

    function handleCalendarOpen() {
        setIsCalendarOpen(true);
    }

    function handleCalendarClose() {
        setIsCalendarOpen(false);
    }

    function handleChangeDateRange(valuesRange) {
        const startWithTimezone = getSameTimeWithCurrentTimezone(valuesRange.begin);
        const endWithTimezone = getSameTimeWithCurrentTimezone(valuesRange.end);

        const formattedStart = moment(startWithTimezone).startOf('day');
        const formattedEnd   = moment(endWithTimezone).endOf('day');

        const isStartChanged = fields.timeRangeStart !== formattedStart;
        const isEndChanged = fields.timeRangeEnd !== formattedEnd;

        if (isStartChanged) {
            handleChange({ name: 'timeRangeStart', value: formattedStart });
        }

        if (isEndChanged) {
            handleChange({ name: 'timeRangeEnd', value: formattedEnd });
        }
    }

    function handleChangeField({ name, value }) {
        handleChange({ name, value });
    }

    function renderBaseField(field, Component) {
        const errorText = errors?.[field.name];
        const isDateInvalid = errors.includes('dates/0/to');
        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [field.type]      : field.type,
            [field.className] : field.className
        });

        const fieldValue = fields[field.name];
        const withTimezone = replaceDateTimezone(fieldValue, timezone, false);
        const processValue = fieldValue ? getSameTimeWithCurrentTimezone(withTimezone) : void 0;

        return (
            <div key={field.name + field.label} className={fieldWrapperCN}>
                { field?.title
                    ? <div className={styles.fieldTitle}>{field?.title}</div>
                    : null
                }
                <Component
                    key          = {`${name}${isProcessing}`}
                    value        = {processValue}
                    name         = {field.name}
                    label        = {field.label}
                    placeholder  = {field.placeholder}
                    onChange     = {handleChangeField}
                    errorMessage = {errorText}
                    isInvalid    = {errorText || isDateInvalid}
                    disabled     = {isProcessing}
                    isProcessing = {isProcessing}
                    {...(field?.props || {})}
                />
            </div>
        );
    }

    const dateRangeCN = cx(styles.DateRange, {
    });

    return (
        <div className={dateRangeCN}>
            <div>
                <Typography
                    className = {cx(styles.subtitle, { 'withIcon': true })}
                    variant   = 'body2'
                    color     = 'greyDark'
                >
                    {t('schedules-page:Select time interval')}
                    <IconButton
                        onClick            = {useCallback(handleCalendarOpen, [])}
                        className          = {styles.calendarIconButton}
                        iconType           = 'calendar'
                    />
                </Typography>
                <div className={styles.rangeFieldsWrapper}>
                    { renderBaseField({
                        name        : 'timeRangeStart',
                        label       : t('schedules-page:Start'),
                        default     : '',
                        className   : styles.timeRangeStartFieldWrapper,
                        placeholder : 'дд/мм/гггг чч:мм',
                        props       : {
                            // withError : false
                        }
                    }, InputDate)}

                    { renderBaseField({
                        name        : 'timeRangeEnd',
                        label       : t('schedules-page:End'),
                        default     : '',
                        className   : styles.timeRangeEndFieldWrapper,
                        placeholder : 'дд/мм/гггг чч:мм',
                        props       : {
                            // withError : false
                            defaultTime : 'dayEnd'
                        }
                    }, InputDate)}
                </div>
            </div>

            <div className={styles.calendarWrapper}>
                <DateRangePicker
                    isTransparentOverlay
                    onChange     = {handleChangeDateRange}
                    format       = 'dd/MM/yyyy'
                    open         = {!!isCalendarOpen}
                    onOpen       = {useCallback(handleCalendarOpen, [])}
                    onClose      = {useCallback(handleCalendarClose, [])}
                    languageId   = {languageId}
                    t            = {t}
                    value        = {useMemo(() => {
                        const { timeRangeStart, timeRangeEnd } = fields;

                        if (timeRangeStart && timeRangeEnd) {
                            return [
                                getSameTimeWithCurrentTimezone(timeRangeStart),
                                getSameTimeWithCurrentTimezone(timeRangeEnd)
                            ];
                        } else if (timeRangeStart && !timeRangeEnd) {
                            return [
                                getSameTimeWithCurrentTimezone(timeRangeStart),
                                getSameTimeWithCurrentTimezone(timeRangeStart)
                            ];
                        } else if (!timeRangeStart && timeRangeEnd) {
                            return [
                                getSameTimeWithCurrentTimezone(timeRangeEnd),
                                getSameTimeWithCurrentTimezone(timeRangeEnd)
                            ];
                        }

                        return [ new Date(), new Date() ];
                    }, [ fields.timeRangeStart, fields.timeRangeEnd ])}
                />
            </div>
        </div>
    );
}

DateRange.propTypes = {
    fields : PropTypes.shape({
        // timeRangeStart : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
        // timeRangeEnd   : PropTypes.oneOfType([ PropTypes.number, PropTypes.string ])
    }),
    onChange     : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    errors       : PropTypes.shape({}),
    timezone     : PropTypes.string,
    languageId   : PropTypes.string,
    t            : PropTypes.func
};

DateRange.defaultProps = {
    fields : PropTypes.shape({
        timeRangeStart : '',
        timeRangeEnd   : ''
    }),
    isProcessing : false,
    errors       : {},
    timezone     : void 0,
    languageId   : void 0,
    t            : (text) => text
};

export default DateRange;

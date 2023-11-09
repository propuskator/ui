/* eslint-disable no-magic-numbers, babel/no-unused-expressions, no-shadow */
import React, {
    useState,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import globalEnterHandler       from 'templater-ui/src/utils/eventHandlers/globalEnterHandler';
import { isArray }              from 'templater-ui/src/utils/typeCheck';
import FormControls             from 'templater-ui/src/components/shared/FormControls';
import Typography               from 'templater-ui/src/components/base/Typography';
import ErrorMessage             from 'templater-ui/src/components/base/ErrorMessage';
import Input                    from 'templater-ui/src/components/base/Input';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import {
    getFormattedDailyIntervalDate
}                               from 'Utils/schedules';
import { deepClone }            from 'Utils';

import WeekDays                 from './WeekDays';
import DateRange                from './DateRange';
import DayTime                  from './DayTime';
import styles                   from './AccessSchedule.less';

const cx = classnames.bind(styles);

const MS_IN_HOUR = 3600 * 1000;
const MS_IN_MINUTE = 60 * 1000;
const SELECTED_FULL_WEEK_DAYS = [ 0, 1, 2, 3, 4, 5, 6 ];

function AccessSchedule(props) {    // eslint-disable-line  max-lines-per-function
    const {
        name, isCreateEntity, closeModal, level, isTopModal, t,
        entityId, entityData,
        onClose,
        updateAccessSchedule, createAccessSchedule
    } = props;

    const [ fields, setFields ] = useState(() => {  // eslint-disable-line complexity
        const {
            name,
            dates = []
        } = entityData;

        const {
            dailyIntervalStart, dailyIntervalEnd,
            weekBitMask,
            from: fromValue,
            to: toValue
        } = dates[0] || {};

        let weekDays = isCreateEntity
            ? SELECTED_FULL_WEEK_DAYS
            : weekBitMask?.map((item, index) => item === 1 ? index : -1)?.filter(item => item !== -1) || [];

        if (!weekBitMask && !isCreateEntity) {
            const isWeekDaysArray = isArray(weekBitMask);

            if (!isWeekDaysArray) {
                weekDays = SELECTED_FULL_WEEK_DAYS;
            }
        }

        const periodicStart = getFormattedDailyIntervalDate(dailyIntervalStart);
        const periodicEnd   = getFormattedDailyIntervalDate(dailyIntervalEnd);

        return ({
            name           : !isCreateEntity && name ? name || '' : '',
            timeRangeStart : !isCreateEntity && fromValue ? +new Date(fromValue) : '',
            timeRangeEnd   : !isCreateEntity && toValue ? +new Date(toValue) : '',
            weekDays,
            periodicStart  : !isCreateEntity ? periodicStart || '' : '00:00',
            periodicEnd    : !isCreateEntity ? periodicEnd || '' : '23:59'
        });
    });

    useEffect(() => {
        function submitOnEnter(e) {
            const { target } = e;

            if ([ 'BUTTON', 'A' ].includes(target.nodeName)) {
                if (target.classList.contains('abort-submit')) return;
            }

            handleSubmit(e);
        }

        globalEnterHandler.register(submitOnEnter);

        return () => {
            globalEnterHandler.unregister(submitOnEnter);
        };
    }, [ fields ]);

    const componentRef                      = useRef({});
    const [ errors, setErrors ]             = useState({});
    const [ isProcessing, setIsProcessing ] = useState(false);

    useEffect(() => {
        return () => {
            if (onClose) {
                onClose(deepClone(componentRef?.current?.onCloseParams));
            }
        };
    }, []);

    function handleCloseModal() {
        closeModal(name);
    }

    function formDataFormatter({ name, value }) {
        switch (name) {
            case 'name':
                return value ? leftrim(value) : value;
            default:
                return value;
        }
    }

    function handleInteract(name) {
        if (!name) return;

        setErrors(prevFields => ({
            ...prevFields,
            [name] : ''
        }));
    }

    function handleChangeField(data) {
        const formatted = formDataFormatter(data);

        setFields(prevFields => ({
            ...prevFields,
            [data.name] : formatted
        }));

        if (data.name === 'timeRangeStart' || data.name === 'timeRangeEnd') {
            setErrors(prevFields => ({
                ...prevFields,
                'dates/0/to' : ''
            }));
        }

        handleInteract(data?.name);
    }

    function leftrim(str) {
        if (!str) return str;

        return str.replace(/^\s+/g, '');
    }

    function getDataToSubmit(fields = {}) {
        const {
            name,
            periodicEnd, periodicStart,
            timeRangeEnd = '', timeRangeStart = '',
            weekDays = []
        } = fields;

        const WEEK_BITS_LENGTH = 7;
        let weekBitMask = new Array(WEEK_BITS_LENGTH).fill(0).map((item, index) => {
            if (!weekDays) return item;

            if (weekDays.includes(index)) return 1;

            return item;
        });

        const fromValue = timeRangeStart ? +new Date(timeRangeStart) : null;
        const toValue   = timeRangeEnd   ? +new Date(timeRangeEnd)   : null;
        let dailyIntervalStart   = void 0;
        const periodicStartParts = periodicStart.split(':');

        if (periodicStartParts.length === 2) {
            const [ hours, minutes ] = periodicStartParts;

            if (hours !== '' || minutes !== '') {
                const msHours   = +hours * MS_IN_HOUR;
                const msMinutes = +minutes * MS_IN_MINUTE;
                const fullMs = msHours + msMinutes;

                if (Number.isInteger(fullMs)) dailyIntervalStart = fullMs;
            }
        }

        let dailyIntervalEnd  = void 0;
        const periodicEndParts = periodicEnd.split(':');

        if (periodicEndParts.length === 2) {
            const [ hours, minutes ] = periodicEndParts;

            if (hours !== '' || minutes !== '') {
                const msHours   = +hours * MS_IN_HOUR;
                const msMinutes = +minutes * MS_IN_MINUTE;
                const fullMs = msHours + msMinutes;

                if (Number.isInteger(fullMs)) dailyIntervalEnd = fullMs;
            }
        }

        const isDailyRangeExist = (dailyIntervalStart || dailyIntervalStart === 0)
            && (dailyIntervalEnd || dailyIntervalEnd === 0);

        if (!isDailyRangeExist && !weekBitMask.includes(0)) {
            weekBitMask = void 0;
        }

        return ({
            name,
            dates : [ {
                weekBitMask,
                from : fromValue,
                to   : toValue,
                dailyIntervalStart,
                dailyIntervalEnd
            } ]
        });
    }

    function checkIsFormValid() {
        return !errors?.name;
    }

    async function handleSubmit(e) {
        const isFormValid = checkIsFormValid();

        if (!isFormValid) return;

        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        const processData = getDataToSubmit(fields);

        try {
            setIsProcessing(true);
            const handler = isCreateEntity ? createAccessSchedule : updateAccessSchedule;
            const payload = isCreateEntity ? processData : { ...processData, id: entityId };

            const entity = await handler(payload);
            // const toastMessage = isCreateEntity
            //     ? t('schedules-page:Schedule has been created')
            //     : t('schedules-page:Schedule has been updated');

            // addToast({
            //     key     : TOASTS_KEYS.accessScheduleUpdate,
            //     title   : t('Action was completed successfully'),
            //     message : toastMessage,
            //     type    : 'success'
            // });

            componentRef.current.onCloseParams = { entity };

            handleCloseModal();
        } catch (error) {
            const fields = {};

            error?.errors?.forEach(element => fields[element.field] = element.message);

            setErrors(fields);
        } finally {
            setIsProcessing(false);
        }
    }

    function renderBaseField(field, Component) {
        const errorText = errors?.[field.name];
        const fieldWrapperCN = cx(styles.fieldWrapper, {
            [field.type]      : field.type,
            [field.className] : field.className
        });

        return (
            <div key={field.name + field.label} className={fieldWrapperCN}>
                { field?.title
                    ? <div className={styles.fieldTitle}>{field?.title}</div>
                    : null
                }
                <Component
                    key          = {`${name}${isProcessing}`}
                    value        = {fields[field.name]}
                    name         = {field.name}
                    label        = {field.label}
                    placeholder  = {field.placeholder}
                    onChange     = {handleChangeField}
                    errorMessage = {errorText}
                    isInvalid    = {errorText}
                    disabled     = {isProcessing}
                    isProcessing = {isProcessing}
                    t            = {t}
                    {...(field?.props || {})}   //  eslint-disable-line
                />
            </div>
        );
    }

    const accessScheduleCN = cx(styles.AccessSchedule, {
        [`${level}Level`] : level,
        topModal          : isTopModal
    });

    const errorKeys = Object.keys(errors || {}) || [];
    const errorsWithoutName = errorKeys.filter(erorrorKey => {
        return ![ 'name', 'dates/0/to' ].includes(erorrorKey) && errors[erorrorKey];
    });
    const formErrors = errorKeys.filter(erorrorKey => {
        return [ 'name', 'dates/0/to' ].includes(erorrorKey) && errors[erorrorKey];
    });

    const isCommonError = errorsWithoutName?.length;

    return (
        <form className={accessScheduleCN}>
            <IconButton
                className = {styles.closeButton}
                iconType  = 'cross'
                onClick   = {handleCloseModal}
            />
            <Typography
                className = {styles.title}
                variant   = 'headline3'
                color     = 'black'
            >
                { isCreateEntity
                    ? t('schedules-page:Create schedule')
                    : t('schedules-page:Edit schedule')
                }
            </Typography>
            <div className={styles.content}>
                { renderBaseField({
                    name      : 'name',
                    label     : t('schedules-page:Schedule name'),
                    default   : '',
                    className : styles.nameFieldWrapper,
                    props     : {
                        autoFocus : true
                        // withError : false
                        // ref       : firstInputRef
                    }
                }, Input)}

                <DateRange
                    onChange     = {handleChangeField}
                    fields       = {fields}
                    isProcessing = {isProcessing}
                    errors       = {formErrors}
                    t            = {t}
                />

                <Typography
                    className = {cx(styles.subtitle, { 'main': true })}
                    variant   = 'body2'
                    color     = 'greyDark'
                >
                    {t('schedules-page:Periodic repetition')}
                </Typography>

                <div className={styles.periodicFieldsWrapper}>
                    <div className={styles.periodicFieldWrapper}>
                        <Typography
                            className = {styles.subtitle}
                            variant   = 'body2'
                            color     = 'greyDark'
                        >
                            {t('schedules-page:Start time')}
                        </Typography>
                        { renderBaseField({
                            name  : 'periodicStart',
                            props : {
                                // withError : false
                            }
                        }, DayTime)}
                    </div>

                    <div className={styles.periodicFieldWrapper}>
                        <Typography
                            className = {styles.subtitle}
                            variant   = 'body2'
                            color     = 'greyDark'
                        >
                            {t('schedules-page:End time')}
                        </Typography>
                        { renderBaseField({
                            name      : 'periodicEnd',
                            className : styles.periodicEndFieldWrapper,
                            props     : {
                                // withError : false
                            }
                        }, DayTime)}
                    </div>
                </div>

                <div className={styles.weekDaysWrapper}>
                    <Typography
                        className = {styles.subtitle}
                        variant   = 'body2'
                        color     = 'greyDark'
                    >
                        {t('schedules-page:Days of the week')}
                    </Typography>

                    { renderBaseField({
                        name      : 'weekDays',
                        type      : 'string',
                        className : styles.weekDaysFieldWrapper,
                        props     : {
                            // withError : false
                        }
                    }, WeekDays)}
                </div>
            </div>

            <ErrorMessage
                error     = {isCommonError
                    ? t('schedules-page:Select a time interval and/or periodic repetition')
                    : null
                }
                className = {styles.commonErrorMessage}
            />

            <FormControls
                className        = {styles.formControls}
                controls         = {{
                    submit : {
                        title : isCreateEntity ? t('Create') : t('Update')
                    }
                }}
                isFormProcessing = {isProcessing}
                isSubmitDisabled = {!!formErrors?.length}
                onSubmit         = {handleSubmit}
            />

        </form>
    );
}

AccessSchedule.propTypes = {
    entityId : PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    entityData : PropTypes.shape({
        name  : PropTypes.string,
        dates : PropTypes.arrayOf(PropTypes.shape({
            dailyIntervalStart : PropTypes.number,
            dailyIntervalEnd   : PropTypes.number,
            weekBitMask        : PropTypes.arrayOf(PropTypes.number),
            from               : PropTypes.number,
            to                 : PropTypes.number
        }))
    }),
    onClose              : PropTypes.func,
    closeModal           : PropTypes.func,
    name                 : PropTypes.string.isRequired,
    updateAccessSchedule : PropTypes.func.isRequired,
    createAccessSchedule : PropTypes.func.isRequired,
    isCreateEntity       : PropTypes.bool,
    isTopModal           : PropTypes.bool,
    level                : PropTypes.oneOf([ 'first', 'second' ]),
    t                    : PropTypes.func.isRequired
};

AccessSchedule.defaultProps = {
    entityId       : '',
    entityData     : {},
    isCreateEntity : false,
    isTopModal     : false,
    level          : 'first',
    closeModal     : void 0,
    onClose        : void 0
};

export default AccessSchedule;

import React, { useState, useEffect } from 'react';
import PropTypes                      from 'prop-types';
import classNames                     from 'classnames';
import { DatePicker, useUtils }       from '@material-ui/pickers';
import withStyles                     from '@material-ui/core/styles/withStyles';

import globalEnterHandler             from './../../../utils/eventHandlers/globalEnterHandler';

import { styles }                     from './StylesDateRangePicker';
import localStyles                    from './DateRangePicker.less';

function DateRangePicker({    /* eslint-disable-line max-lines-per-function */
    classes,
    value,
    onChange,
    labelFunc,
    format,
    emptyLabel,
    autoOk,
    onOpen,
    onClose,
    t,
    open: openForward,
    isTransparentOverlay,
    ...props
}) {
    const [ currentDate, setCurrentDate ] = useState(() => {
        if (value) {
            if (value[0]) return new Date(+value[0]);
            else if (value[1]) return new Date(+value[1]);
        }

        return [ new Date(), new Date() ];
    });

    function handleChangeValue({ begin, end }) {
        onChange({ begin, end });
    }

    const [ begin, setBegin ]           = useState(value[0]);
    const [ end, setEnd ]               = useState(value[1]);
    const [ prevBegin, setPrevBegin ]   = useState(undefined);
    const [ prevEnd, setPrevEnd ]       = useState(undefined);
    const [ hasClicked, setHasClicked ] = useState(false);

    const [ hover, setHover ]       = useState(undefined);
    const [ accepted, setAccepted ] = useState(false);
    const utils = useUtils();

    const min = Math.min(begin, end || hover);
    const max = Math.max(begin, end || hover);

    const [ open, setOpen ] = useState(false);

    const isOpen = openForward !== undefined ? openForward : open;

    useEffect(() => {
        function submitOnEnter() {
            // prevent modal submit if daterangepicker open
            handlePickerAccept();
            handlePickerClose();
        }

        if (openForward) globalEnterHandler.register(submitOnEnter);
        else globalEnterHandler.unregister(submitOnEnter);

        return () => {
            globalEnterHandler.unregister(submitOnEnter);
        };
    }, [ openForward ]);

    useEffect(() => {
        // Only way to get to this state is is openForward is used
        if (isOpen && accepted && !prevBegin && !prevEnd) {
            setAccepted(false);
            setPrevBegin(begin);
            setPrevEnd(end);

            return;
        }
        // Closed without accepting, reset to prev state, don't find onChange
        if (!isOpen && !accepted) {
            setBegin(prevBegin);
            setEnd(prevEnd);
            setHover(undefined);
            setHasClicked(false);
        }
        // Auto ok and hasn't been accepted, but has all the items set, accept and close.
        // This will also triger the on change event by setting isOpen to false
        if (isOpen && autoOk && !accepted && begin && end && hasClicked) {
            setAccepted(true);
            if (onClose) onClose(); else setOpen(false);
        }

        if (accepted && begin && end && !isOpen && hasClicked) {
            setHasClicked(false);
            handleChangeValue({ begin, end });
            if (onClose) onClose(); else setOpen(false);
        } else if (accepted && begin && end  && !isOpen) {
            setHasClicked(false);
            handleChangeValue({ begin, end });
            setBegin(void 0);
            setEnd(void 0);
            if (onClose) onClose(); else setOpen(false);
        }
    }, [ begin, end, autoOk, accepted, isOpen, prevBegin, hasClicked, prevEnd ]);

    useEffect(() => {
        setBegin(value[0]);
        setEnd(value[1]);
        setPrevBegin(value[0]);
        setPrevEnd(value[1]);

        if (!isOpen && !accepted) {
            setHover(undefined);
            setHasClicked(false);
        }
    }, [ value ]);

    function handleDateChange(date) {
        setCurrentDate(date);
    }

    function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
        return React.cloneElement(dayComponent, {
            onClick : e => {
                setHasClicked(true);
                e.stopPropagation();
                if (begin && end) {
                    setBegin(day);
                    setEnd(null);

                    return;
                }

                if (!begin) setBegin(day);
                else if (!end) {
                    if (utils.isBeforeDay(day, begin)) {
                        setEnd(begin);
                        setBegin(day);
                    } else {
                        setEnd(day);
                    }
                    if (autoOk) {
                        setPrevBegin(undefined);
                        setPrevEnd(undefined);
                    }
                } else {
                    setBegin(day);
                    setEnd(undefined);
                }
            },
            onMouseEnter : () => requestAnimationFrame(() => setHover(day)),
            onFocus      : () => requestAnimationFrame(() => setHover(day)),
            className    : classNames(classes.day, {
                [classes.hidden]       : dayComponent.props.hidden,
                [classes.current]      : dayComponent.props.current,
                [classes.dayDisabled]  : dayComponent.props.disabled,
                [classes.focusedRange] :
            (utils.isAfterDay(day, min) && utils.isBeforeDay(day, max)) ||
            (utils.isSameDay(day, min) && !utils.isSameDay(day, max)) ||
            (utils.isSameDay(day, max) && !utils.isSameDay(day, min)),
                [classes.focusedFirst] :
            utils.isSameDay(day, min) && !utils.isSameDay(day, max),
                [classes.focusedLast] :
            utils.isSameDay(day, max) && !utils.isSameDay(day, min),
                [classes.beginCap]    : utils.isSameDay(day, min),
                [classes.endCap]      : utils.isSameDay(day, max),
                [classes.selectedDay] : (
                    begin && end && utils.isSameDay(day, min) && utils.isSameDay(day, max)
                )
            })
        });
    }

    function formatDate(date) {
        return utils.format(date, format || utils.dateFormat);
    }

    function handlePickerOpen() {
        setAccepted(false);
        setPrevBegin(begin);
        setPrevEnd(end);
        if (onOpen) onOpen(); else setOpen(true);
    }

    function handlePickerAccept() {
        setAccepted(true);
    }

    function handlePickerClose() {
        if (onClose) onClose(); else setOpen(false);
    }

    function labelFuncHandler(date, invalid) {
        if (!isOpen) {
            if (labelFunc) return labelFunc([ begin, end ], invalid);
            if (date && begin && end) return `${formatDate(begin)} - ${formatDate(end)}`;

            return emptyLabel || '';
        }

        if (prevBegin && prevEnd) {
            if (labelFunc) return labelFunc([ prevBegin, prevEnd ], invalid);

            return `${formatDate(prevBegin)} - ${formatDate(prevEnd)}`;
        }

        return emptyLabel || '';
    }

    return (
        <DatePicker
            {...props}
            autoOk               = {autoOk}
            value                = {currentDate}
            renderDay            = {renderDay}
            open                 = {isOpen}
            onOpen               = {handlePickerOpen}
            onAccept             = {handlePickerAccept}
            onClose              = {handlePickerClose}
            onChange             = {handleDateChange}
            labelFunc            = {labelFuncHandler}
            DialogProps          = {{
                className : classNames(
                    classes.dateRangePickerDialog,
                    isTransparentOverlay ? localStyles.transparentOverlay : ''
                )
            }}
            cancelLabel          = {t('Cancel')}
            okLabel              = {t('Ok')}
            variant              = 'outlined'
            allowKeyboardControl = {false}
            orientation          = 'portrait'
        />
    );
}

DateRangePicker.propTypes = {
    value                : PropTypes.array,
    classes              : PropTypes.shape({}).isRequired,
    onChange             : PropTypes.func,
    labelFunc            : PropTypes.func,
    onOpen               : PropTypes.func,
    onClose              : PropTypes.func,
    emptyLabel           : PropTypes.string,
    format               : PropTypes.string.isRequired,
    autoOk               : PropTypes.bool,
    open                 : PropTypes.bool.isRequired,
    isTransparentOverlay : PropTypes.bool,
    t                    : PropTypes.func
};

DateRangePicker.defaultProps = {
    value                : [],
    onOpen               : void 0,
    onClose              : void 0,
    onChange             : void 0,
    emptyLabel           : void 0,
    labelFunc            : void 0,
    autoOk               : false,
    isTransparentOverlay : false,
    t                    : (text) => text
};

export default withStyles(styles, { name: 'DateRangePicker' })(DateRangePicker);

import React, { useCallback, useState } from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import { TimePicker }     from '@material-ui/pickers';
import withStyles         from '@material-ui/core/styles/withStyles';


import Loader             from '../../Loader/';

import { EMPTY_TEXT }     from '../../../../constants';

import { styles }         from './StylesTimePicker';
import localStyles        from './TimePicker.less';

const cx = classnames.bind(localStyles);

function TimePickerControl(props) {
    const {
        value, onChange, themeMode, classes,
        isProcessing, isDisabled, t
    } = props;

    // const [ selectedTime, setSelectedTime ] = useState(value);
    const [ isOpen, setIsOpen ] = useState(false);

    function getInitialValue(time) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = now.getDate();
        const hours = time.split(':')?.[0];
        const minutes = time.split(':')?.[1];
        const initialDate = new Date(year, month, date, hours, minutes);

        if (isNaN(Date.parse(initialDate))) {
            return { initialTime: '--:--', initialDate: new Date() };
        }

        return { initialTime: `${getMinutesWithZero(hours)}:${getMinutesWithZero(minutes)}`, initialDate };
    }

    function getMinutesWithZero(minutes) {
        /* eslint-disable-next-line no-magic-numbers*/
        if (minutes.length < 2 && +minutes < 10) {
            return `0${minutes}`;
        }

        return minutes;
    }

    function handleTimeChange(date) {
        const validDate = date || new Date();
        const timeToSet = `${getMinutesWithZero(validDate.getHours())}:${getMinutesWithZero(validDate.getMinutes())}`;

        if (onChange) onChange({ value: timeToSet });
    }

    function handleOpenTimePicker() {
        if (isProcessing || isDisabled) return;
        setIsOpen(true);
    }

    function renderTime() {
        const defaultValue = '--:--';
        const timeToShow = getInitialValue(value)?.initialTime;

        const timeRegExp = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

        return (
            <div
                className = {cx(localStyles.time, { disabled: isDisabled })}
                onClick = {handleOpenTimePicker}
            >
                {timeToShow.match(timeRegExp) ? timeToShow : defaultValue || defaultValue}
            </div>
        );
    }

    const timePickerCN = cx(localStyles.TimePicker, { [`${themeMode}Theme`]: themeMode });

    return (
        <div className = {timePickerCN}>
            <div className={localStyles.timePickerWrapper}>
                <TimePicker
                    clearable
                    ampm={false}
                    value={getInitialValue(value)?.initialDate}
                    open = {isOpen}
                    onOpen = {useCallback(() => setIsOpen(true), [])}
                    onClose = {useCallback(() => setIsOpen(false), [])}
                    onChange={handleTimeChange}
                    DialogProps = {{
                        className : cx(classes.timePickerDialog)
                    }}
                    cancelLabel = {t('Cancel')}
                    okLabel = {t('Ok')}
                    clearLabel = {t('Clear')}
                />
            </div>
            {
                isProcessing ? (
                    <div className={localStyles.loaderWrapper}>
                        <Loader
                            size='XS'
                            color='primary'
                        />
                    </div>
                ) : renderTime()
            }
        </div>
    );
}

TimePickerControl.propTypes = {
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    themeMode    : PropTypes.string,
    onChange     : PropTypes.func,
    classes      : PropTypes.shape({}).isRequired,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    t            : PropTypes.func
};

TimePickerControl.defaultProps = {
    value        : EMPTY_TEXT,
    themeMode    : '',
    onChange     : void 0,
    isDisabled   : false,
    isProcessing : false,
    t            : (text) => text
};

export default withStyles(styles)(TimePickerControl);

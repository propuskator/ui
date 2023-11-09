/* eslint-disable max-lines-per-function */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

// import moment                      from 'moment';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils                from '@date-io/date-fns';
// import ruLocale                    from 'date-fns/locale/ru';
// import format                      from 'date-fns/format';
import * as localStorageUtils      from '../../../../utils/helpers/localStorage';
import { TIMELINE_WIDGET_DATA }    from '../../../../constants/localStorage';

import IconButton      from '../../../base/IconButton/IconButton';
import CriticalValue   from '../../CriticalValue';
import Loader          from '../../Loader';
import Slider          from '../../Slider';
// import DateRangePicker from './../../../shared/DateRangePicker';

import LineChart from './Line';

import styles from './Number.less';

// class LocalizedUtils extends DateFnsUtils {
//     getDatePickerHeaderText(date) {
//         return format(date, 'cccccc, d MMMM', { locale: this.locale });
//     }

//     getCalendarHeaderText(date) {
//         return format(date, 'LLLL yyyy', { locale: this.locale });
//     }
// }

// const LOCALES_UTILS_BY_LANG = {
//     ru : ruLocale
// };

const cx = classnames.bind(styles);

const DEFAULT_TIMELINE_INTERVALS = [ '1m', '30m', '1h', '12h', '24h' ];
const DEFAULT_TIMELINE_PERIODS = [ '1h', '12h', '24h', '7d', '30d', '60d' ];
const DEFAULT_REFRESH_FREQUENCY = [ '1m', '5m', '10m', '20m', '30m', '1h' ];

const DEFAULT_INTERVAL = '1h';
const DEFAULT_PERIOD = '24h';
const DEFAULT_FREQUENCY = '1m';

function Number(props) {
    const {
        widgetTopic,
        id,
        unit,
        minY,
        maxY,
        maxUnitLength,
        themeMode,
        fetchPeriods,
        fetchIntervals,
        fetchTimeline,
        // languageId,
        t
    } = props;

    const componentRef = useRef({});

    const savedSettings = localStorageUtils.getData(TIMELINE_WIDGET_DATA)?.[id] || {};

    const [ timelinePeriods, setTimelinePeriods ] = useState(DEFAULT_TIMELINE_INTERVALS);
    const [ timelineIntervals, setTimelineIntervals ] = useState(DEFAULT_TIMELINE_PERIODS);
    const [ timelineData, setTimelineData ] = useState();

    const [ period, setPeriod ] = useState(savedSettings?.period || DEFAULT_PERIOD);
    const [ interval, setTimeInterval ] = useState(savedSettings?.interval || DEFAULT_INTERVAL);
    const [ frequency, setFrequency ] = useState(savedSettings?.frequency || DEFAULT_FREQUENCY);
    // const [ dateFrom, setDateFrom ] = useState('');
    // const [ dateTo, setDateTo ] = useState('');

    // const [ isDatePickerOpen, setIsDatePickerOpen ] = useState(false);
    const [ isToolsVisible, setIsToolsVisible ] = useState(false);
    const [ isProcessing, setIsProcessing ] = useState(true);

    useEffect(() => {
        getReferences();
        getTimeline();
    }, [ period, interval ]);

    useEffect(() => {
        clearTimeout(componentRef.current.timeout);
        getTimelineWithInterval();

        return () => {
            clearTimeout(componentRef.current.timeout);
        };
    }, [ frequency, period, interval ]);

    function getSliderValues(values) {
        return values.map((item, index) => {
            return { value: index, label: item };
        });
    }

    function getUnit() {
        return unit?.length > maxUnitLength ? `${unit.slice(0, maxUnitLength)}...` : unit;
    }

    function getTimeInMs(time) {
        const timeUnit = time[time.length - 1];

        switch (timeUnit) {
            case 'm':
                /* eslint-disable-next-line no-magic-numbers */
                return parseInt(time, 10) * 60000;
            case 'h':
                /* eslint-disable-next-line no-magic-numbers */
                return parseInt(time, 10) * 360000;
            default:
                return time;
        }
    }

    function saveSettings({ name, value }) {
        const localSettings = localStorageUtils.getData(TIMELINE_WIDGET_DATA) || {};
        const localSettingsById = localStorageUtils.getData(TIMELINE_WIDGET_DATA)?.[id] || {};

        localStorageUtils.saveData(TIMELINE_WIDGET_DATA, {
            ...localSettings,
            [id] : {
                ...localSettingsById,
                [name] : value
            }
        });
    }

    async function handleCommitIntervalValue({ name, value }) {
        switch (name) {
            case 'period':
                setPeriod(timelinePeriods[value]);
                saveSettings({ name, value: timelinePeriods[value] });
                break;
            case 'interval':
                setTimeInterval(timelineIntervals[value]);
                saveSettings({ name, value: timelineIntervals[value] });
                break;
            case 'frequency':
                setFrequency(DEFAULT_REFRESH_FREQUENCY[value]);
                saveSettings({ name, value: DEFAULT_REFRESH_FREQUENCY[value] });
                break;
            default:
        }
    }

    function handleChangeIntervalValue() {
    }

    async function getReferences() {
        if (!fetchPeriods || !fetchIntervals) return;

        const periods = await fetchPeriods();

        if (periods) setTimelinePeriods(periods);

        const intervals = await fetchIntervals();

        if (intervals) setTimelineIntervals(intervals);
    }

    async function getTimeline() {
        if (!fetchTimeline) return null;

        try {
            setIsProcessing(true);
            // const offset = moment().utcOffset();
            // const beginFormatted = moment(dateFrom).add(offset, 'm').toISOString();
            // const endFormatted   = moment(dateTo).add(offset, 'm').toISOString();

            const timeline = await fetchTimeline({
                period,
                interval,
                topic : widgetTopic
            });

            if (timeline) setTimelineData(timeline?.data);
        } catch (error) {
            console.error('Fetch timeline error: ', error);
        } finally {
            setIsProcessing(false);
        }
    }

    async function getTimelineWithInterval() {
        await getTimeline();
        componentRef.current.timeout = setTimeout(() => getTimelineWithInterval(), getTimeInMs(frequency));
    }

    // function handleDateRangeUpdate(valuesRange) {
    //     const begin = +new Date(moment(valuesRange.begin).startOf('day'));
    //     const end = +new Date(moment(valuesRange.end).endOf('day'));

    //     if (begin && end) {
    //         setDateFrom(begin);
    //         setDateTo(end);
    //     }
    // }

    // function cleanDate() {
    //     if (dateFrom && dateTo) {
    //         setDateFrom('');
    //         setDateTo('');
    //     }
    // }

    function handleToolsOpen() {
        return setIsToolsVisible(prevValue => !prevValue);
    }

    function renderSlider(name, defaultValue, labels) {
        const marks = getSliderValues(labels);
        const sliderValue = labels.indexOf(defaultValue) || null;

        return (
            <div className={cx(styles.item, { [`${themeMode}Theme`]: themeMode })}>
                <Slider
                    value            = {sliderValue}
                    name             = {name}
                    max              = {marks.length - 1}
                    min              = {marks[0].value}
                    step             = {null}
                    marks            = {marks}
                    isProcessing     = {isProcessing}
                    isDisabled       = {!timelineData}
                    onChange         = {handleCommitIntervalValue}
                    onChangeSlider   = {handleChangeIntervalValue}
                    themeMode        = {themeMode}
                />
            </div>
        );
    }

    function renderTimeline() {
        const filteredData = timelineData.filter(item => item?.value >= minY && item?.value <= maxY);
        const data = filteredData.map(item => item?.value) || [];
        const labels = filteredData.map(item => item?.time) || [];

        const datasets = [ {
            label                : '',
            data,
            fill                 : true,
            borderColor          : '#029487',
            pointBackgroundColor : '#029487',
            backgroundColor      : '#72c4bd1a',
            lineTension          : 0.2,
            borderWidth          : 1,
            pointRadius          : 1.5,
            pointHoverRadius     : 2,
            cursor               : 'pointer'
        } ];

        if (isProcessing) {
            return (
                <div className={styles.loaderWrapper}>
                    <Loader size='S' />
                </div>
            );
        }

        if (!data.length || !labels.length) {
            return (<div className={styles.noDataMessage}>
                {t('No data to display')}
            </div>);
        }

        return (
            <LineChart
                className = {styles.chart}
                datasets  = {datasets}
                labels    = {labels}
                minY      = {+minY}
                maxY      = {+maxY}
                themeMode = {themeMode}
            />);
    }

    // function renderDatesRange() {
    //     return (
    //         <>
    //             <div key={languageId}>
    //                 <MuiPickersUtilsProvider utils={LocalizedUtils} locale={LOCALES_UTILS_BY_LANG[languageId]}>
    //                     <div className={cx(styles.datesRangeWrapper, { hiden: !dateFrom || !dateTo })}>
    //                         <DateRangePicker
    //                             placeholder = {t('Select a date range')}
    //                             onChange    = {handleDateRangeUpdate}
    //                             format      = 'dd.MM.yy'
    //                             value       = {useMemo(() => {
    //                                 return dateFrom && dateTo
    //                                     ?  ([ dateFrom, dateTo ])
    //                                     : [ new Date(), new Date() ];
    //                             }, [ dateFrom, dateTo ])
    //                             }
    //                             open        = {isDatePickerOpen}
    //                             onOpen      = {useCallback(() => setIsDatePickerOpen(true), [])}
    //                             onClose     = {useCallback(() => setIsDatePickerOpen(false), [])}
    //                             languageId  = {languageId}
    //                             t           = {t}
    //                             disableFuture
    //                         />
    //                         <div
    //                             className = {styles.clearIconWrapper}
    //                             onClick = {cleanDate}
    //                         >
    //                             <IconButton
    //                                 onClick            = {cleanDate}
    //                                 className          = {styles.clearIconButton}
    //                                 disableFocusRipple = {false}
    //                                 iconType           = 'cross'
    //                             />
    //                         </div>
    //                     </div>
    //                 </MuiPickersUtilsProvider>
    //                 <div
    //                     className={cx(styles.selectDatesTextWrapper, { hiden: dateFrom && dateTo })}
    //                     onClick = {useCallback(() => setIsDatePickerOpen(true), [])}
    //                 >
    //                     {t('Select a date range')}
    //                     <IconButton
    //                         onClick   = {useCallback(() => setIsDatePickerOpen(true), [])}
    //                         className = {styles.calendarIconButton}
    //                         iconType  = 'calendar'
    //                     />
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }
    const numberCN = cx(styles.Number, { [`${themeMode}Theme`]: themeMode });

    return (
        <div className={numberCN}>
            <div className={styles.topicValue}>
                <CriticalValue
                    className  = {styles.value}
                    value      = {props.value || '—'}
                />
                <CriticalValue
                    className  = {styles.unit}
                    value      = {getUnit()}
                />
            </div>
            {/* {renderDatesRange()} */}
            { timelineData
                ? renderTimeline()
                : (
                    <div className={styles.loaderWrapper}>
                        <Loader size='S' />
                    </div>
                )
            }
            <div
                className={styles.toolsPanel}
            >
                <div>{t('Tools')}</div>
                <IconButton
                    iconType  = 'arrowRightThin'
                    className = {cx(styles.arrow, {
                        opened : !isToolsVisible
                    })}
                    onClick={handleToolsOpen}
                />
            </div>
            { (<div className={styles.toolsWrapper}>
                <div
                    className={cx(styles.tools, {
                        hidden : !isToolsVisible
                    })}>
                    <div className={styles.toolTitle}>{t('Time range')}</div>
                    {renderSlider('period', period, timelinePeriods)}
                    <div className={styles.toolTitle}>{t('Density')}</div>
                    {renderSlider('interval', interval, timelineIntervals)}
                    <div className={styles.toolTitle}>{t('Update frequency')}</div>
                    {renderSlider('frequency', frequency, DEFAULT_REFRESH_FREQUENCY)}
                </div>
            </div>
            )
            }
        </div>
    );
}

Number.propTypes = {
    value          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    id             : PropTypes.string,
    unit           : PropTypes.string,
    minY           : PropTypes.string,
    maxY           : PropTypes.string,
    maxUnitLength  : PropTypes.number,
    themeMode      : PropTypes.string,
    widgetTopic    : PropTypes.string,
    fetchPeriods   : PropTypes.func,
    fetchIntervals : PropTypes.func,
    fetchTimeline  : PropTypes.func,
    // languageId     : PropTypes.string,
    t              : PropTypes.func
};

Number.defaultProps = {
    id             : '',
    value          : '',
    unit           : '',
    minY           : '',
    maxY           : '',
    maxUnitLength  : 7,
    themeMode      : '',
    widgetTopic    : '',
    fetchPeriods   : void 0,
    fetchIntervals : void 0,
    fetchTimeline  : void 0,
    // languageId    : '',
    t              : (text) => text
};

export default Number;

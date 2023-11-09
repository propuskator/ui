/* eslint-disable  no-magic-numbers */
import React                    from 'react';
import classnames               from 'classnames/bind';
import PropTypes                from 'prop-types';

import { Line }                 from 'react-chartjs-2';

import { formatDate }           from '../../../../../utils/date';

import styles                   from './Line.less';

const cx = classnames.bind(styles);


function LineChart(props) {
    const {
        className,
        datasets,
        labels,
        minY,
        maxY,
        themeMode
    } = props;

    function isDuplicateLabel(label, values) {
        const date = formatDate({ date: new Date(label), format: 'DD.MM.YY' });
        const formattedLabels = values.map(item => formatDate({ date: new Date(item), format: 'DD.MM.YY' }));

        return formattedLabels.includes(date);
    }

    const lineCN = cx(styles.Line, {
        [className] : className
    });

    const isDarkMode = [ 'dark' ].includes(themeMode);

    return (
        <div className={lineCN}>
            <Line
                data = {{
                    datasets,
                    labels
                }}
                options = {{
                    responsive          : true,
                    maintainAspectRatio : false,
                    scales              : {
                        xAxes : [ {
                            ticks : {
                                maxRotation : 45,
                                minRotation : 0,
                                fontColor   : isDarkMode ? '#D9D9D9' : '#666',
                                fontSize    : 8,
                                callback(value, index, values) {
                                    if (isDuplicateLabel(
                                        value,
                                        values.slice(0, index)?.map(item => item.value)
                                    )) return;

                                    const date = new Date(value?.slice(0, -2));

                                    return `${formatDate({ date, format: 'DD.MM.YY' })}`;
                                },
                                source : 'auto'
                            },
                            gridLines : {
                                lineWidth : 0.5,
                                color     : '#D9D9D9'
                            },
                            bounds : 'ticks',
                            time   : {
                                displayFormats : {
                                    day : 'DD.MM.YY'
                                },
                                tooltipFormat : 'DD.MM.YY HH:mm',
                                unit          : 'day'
                            },
                            display    : true,
                            scaleLabel : {
                                display     : false,
                                labelString : 'Time'
                            }

                        } ],
                        yAxes : [ {
                            ticks : {
                                maxTicksLimit : 7,
                                fontColor     : isDarkMode ? '#D9D9D9' : '#666',
                                min           : minY,
                                max           : maxY,
                                beginAtZero   : false,
                                precision     : 0,
                                fontSize      : 9,
                                padding       : 2
                            },
                            gridLines : {
                                lineWidth : 0.5,
                                color     : '#D9D9D9'
                            }

                        } ]
                    },
                    legend : {
                        display : false
                    },
                    elements : {
                        line : {
                            borderWidth : 1,
                            tension     : 0.4
                        }
                    },
                    tooltips : {
                        callbacks : {
                            label(context) {
                                const { value } = context;

                                return `${value}`;
                            },
                            title(context) {
                                const { label } = context[0];

                                return `${formatDate({ date: new Date(label), format: 'DD.MM HH:mm' })}`;
                            }
                        }
                    }
                }}
            />
        </div>
    );
}

LineChart.propTypes = {
    datasets : PropTypes.arrayOf(PropTypes.shape({
        backgroundColor : PropTypes.string,
        borderColor     : PropTypes.string,
        borderWidth     : PropTypes.number,
        fill            : PropTypes.bool,
        data            : PropTypes.arrayOf(PropTypes.number)
    })).isRequired,
    labels    : PropTypes.arrayOf(PropTypes.string).isRequired,
    minY      : PropTypes.number,
    maxY      : PropTypes.number,
    themeMode : PropTypes.string,
    className : PropTypes.string
};

LineChart.defaultProps = {
    minY      : 0,
    maxY      : 100,
    themeMode : '',
    className : ''
};

export default LineChart;

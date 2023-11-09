import React, {
    useEffect
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import globalEscHandler   from '../../../../../utils/eventHandlers/globalEscHandler';
import Gauge              from '../../../../base/controls/Gauge';
import NumberWidget       from '../../../../base/controls/Number';

import styles             from './ViewWidgetScreen.less';

const cx = classnames.bind(styles);

function ViewWidgetScreen(props) {
    const {
        widgetToShow, closeScreen, themeMode, t,
        fetchPeriods, fetchIntervals, fetchTimeline
    } = props;

    useEffect(() => {
        function handleEscClick() {
            closeScreen();
        }

        if (!!widgetToShow) {
            globalEscHandler.register(handleEscClick);
        }

        return () => {
            if (!!widgetToShow) {
                globalEscHandler.unregister(handleEscClick);
            }
        };
    }, [ !!widgetToShow ]);

    function renderWidgetByType() {
        const { advanced, dataType, value, type, widgetTopic, id } = widgetToShow || {};

        // eslint-disable-next-line default-case
        switch (type) {
            case 'gauge':
                return (
                    <div className={styles.widgetCentered}>
                        <Gauge
                            value    = {value}
                            unit     = {advanced?.unit}
                            min      = {advanced?.min}
                            max      = {advanced?.max}
                            dataType = {dataType}
                            themeMode = {themeMode}
                        />
                    </div>
                );
            case 'number':
                return (
                    <div>
                        <NumberWidget
                            widgetTopic    = {widgetTopic}
                            id             = {id}
                            unit           = {advanced?.unit}
                            minY           = {advanced?.minY}
                            maxY           = {advanced?.maxY}
                            dataType       = {dataType}
                            themeMode      = {themeMode}
                            value          = {value}
                            fetchPeriods   = {fetchPeriods}
                            fetchIntervals = {fetchIntervals}
                            fetchTimeline  = {fetchTimeline}
                            // languageId     = {language}
                            t              = {t}
                        />
                    </div>
                );
        }
    }

    return (
        <div className={cx(styles.ViewWidgetScreen, { [`${themeMode}Theme`]: themeMode })}>
            {renderWidgetByType()}
        </div>
    );
}

ViewWidgetScreen.propTypes = {
    widgetToShow : PropTypes?.shape({
        type  : PropTypes.string,
        name  : PropTypes.string,
        value : PropTypes.string
    }),
    closeScreen    : PropTypes.func.isRequired,
    themeMode      : PropTypes.string,
    t              : PropTypes.func,
    fetchPeriods   : PropTypes.func,
    fetchIntervals : PropTypes.func,
    fetchTimeline  : PropTypes.func
};

ViewWidgetScreen.defaultProps = {
    widgetToShow   : void 0,
    themeMode      : '',
    t              : (text) => text,
    fetchPeriods   : void 0,
    fetchIntervals : void 0,
    fetchTimeline  : void 0
};

export default ViewWidgetScreen;

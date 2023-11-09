import React, {
    useState,
    useEffect
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import ScreenHeading    from '../ScreenHeading';
import ViewWidgetScreen from './ViewWidgetScreen';
import EditWidgetScreen from './EditWidgetScreen';

import styles           from './WidgetScreen.less';

const cx = classnames.bind(styles);


function getScreenOffset({ type } = {}) {
    if ([ 'number' ].includes(type)) return 0;

    const SCREEN_OFFSET_BY_TYPE = {
        input : 230,
        gauge : 100
    };

    return SCREEN_OFFSET_BY_TYPE[type] || 120;  // eslint-disable-line  no-magic-numbers
}

function WidgetScreen(props) {
    const {
        smartHome,
        mode, widgetData, closeWidgetScreen,
        isBrokerConnected, isDeviceDisabled,
        themeMode, t, setWidgetValue
    } = props;

    const [ isInitialized, setIsInitialized ] = useState(false);

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    const widgetScreenCN = cx(styles.WidgetScreen, {
        [`${themeMode}Theme`] : themeMode,
        initialized           : isInitialized
    });

    const screenOffset = getScreenOffset({ type: widgetData?.type });
    const isFullScreenWidget = [ 'number' ].includes(widgetData?.type);

    return (
        <div className={widgetScreenCN}>
            <div className={styles.overlay} onClick={closeWidgetScreen} style={{ height: screenOffset }} />
            <div className={styles.screenContent} style={{ height: `calc(100% - ${screenOffset}px)` }}>
                <ScreenHeading
                    title              = {widgetData?.name || ''}
                    closeScreen        = {closeWidgetScreen}
                    isDisableTooltip   = {!widgetData || !isBrokerConnected}
                    isFullScreenWidget = {!!isFullScreenWidget}
                    themeMode          = {themeMode}
                    t                  = {t}
                />
                { mode === 'edit'
                    ? (
                        <EditWidgetScreen
                            widgetToEdit      = {widgetData}
                            closeScreen       = {closeWidgetScreen}
                            isBrokerConnected = {isBrokerConnected}
                            isDeviceDisabled  = {isDeviceDisabled}
                            themeMode         = {themeMode}
                            t                 = {t}
                            setWidgetValue    = {setWidgetValue}
                            smartHome         = {smartHome}
                        />
                    ) : (
                        <ViewWidgetScreen
                            {...props}
                            widgetToShow      = {widgetData}
                            closeScreen       = {closeWidgetScreen}
                            themeMode         = {themeMode}
                            t                 = {t}
                        />
                    )
                }
            </div>
        </div>
    );
}

WidgetScreen.propTypes = {
    mode       : PropTypes.oneOf([ 'edit', 'view' ]).isRequired,
    widgetData : PropTypes?.shape({
        type  : PropTypes.string,
        name  : PropTypes.string,
        value : PropTypes.string
    }),
    isBrokerConnected : PropTypes.bool,
    isDeviceDisabled  : PropTypes.bool,
    closeWidgetScreen : PropTypes.func.isRequired,
    themeMode         : PropTypes.string,
    t                 : PropTypes.func,
    setWidgetValue    : PropTypes.func,
    smartHome         : PropTypes.object
};

WidgetScreen.defaultProps = {
    widgetData        : void 0,
    themeMode         : '',
    isBrokerConnected : false,
    isDeviceDisabled  : false,
    setWidgetValue    : void 0,
    t                 : (text) => text,
    smartHome         : void 0
};

export default WidgetScreen;

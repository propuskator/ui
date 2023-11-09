import React                from 'react';
import PropTypes            from 'prop-types';

import BulbBrightness       from '../../../../../base/controls/BulbBrightness';
import ColorPicker          from '../../../../../base/controls/ColorPicker';

import styles               from '../EditWidgetScreen.less';

function RealTimeScreen(props) {
    const {
        widgetToEdit, isProcessing, isDeviceDisabled, isBrokerConnected,
        onSubmit, themeMode, t
    } = props;

    const {
        type,
        topics,
        settable,
        topicsInstances,
        advanced
    } = widgetToEdit || {};

    function renderEditWidget() {
        switch (type) {
            case 'bulb':
                return (
                    <BulbBrightness
                        className        = {styles.fieldCentered}
                        topics           = {topics}
                        isProcessing     = {isProcessing}
                        advanced         = {advanced}
                        values           = {[ [ 'true', true ]?.includes(topicsInstances[0]?.value), topicsInstances[1]?.value ]}
                        onChange         = {onSubmit}
                        isSettable       = {settable}
                        isDisabled       = {isDeviceDisabled  || !isBrokerConnected}
                        themeMode        = {themeMode}
                        t                = {t}
                    />
                );
            case 'color':
                return (
                    <div className={styles.fieldCentered}>
                        <ColorPicker
                            width          = {285}
                            height         = {150}
                            type           = {widgetToEdit?.format}
                            value          = {topicsInstances[0]?.value}
                            name           = {topics[0] || ''}
                            isProcessing   = {isProcessing}
                            isDisabled     = {isProcessing}
                            isNotClickable = {isProcessing}
                            onChange       = {onSubmit}
                            themeMode      = {themeMode}
                        />
                    </div>
                );
            default: return null;
        }
    }

    return renderEditWidget();
}

RealTimeScreen.propTypes = {
    widgetToEdit      : PropTypes.shape({}).isRequired,
    processingTopics  : PropTypes.arrayOf(PropTypes.string),
    themeMode         : PropTypes.string,
    isProcessing      : PropTypes.bool,
    isBrokerConnected : PropTypes.bool,
    isDeviceDisabled  : PropTypes.bool,
    onSubmit          : PropTypes.func.isRequired,
    t                 : PropTypes.func
};

RealTimeScreen.defaultProps = {
    processingTopics  : [],
    themeMode         : '',
    isProcessing      : false,
    isBrokerConnected : false,
    isDeviceDisabled  : false,
    t                 : t => t
};

export default RealTimeScreen;

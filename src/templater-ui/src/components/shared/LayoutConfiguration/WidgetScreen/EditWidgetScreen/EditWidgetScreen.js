import React, {
    useEffect
}                                   from 'react';
import PropTypes                    from 'prop-types';

import globalEscHandler             from '../../../../../utils/eventHandlers/globalEscHandler';

import RealTimeScreen               from './RealTimeScreen';
import ControlledScreen             from './ControlledScreen';

import styles                       from './EditWidgetScreen.less';

const REAL_TIME_WIDGETS = [ 'bulb', 'color' ];

function EditWidgetScreen(props) {
    const {
        widgetToEdit,
        isBrokerConnected,
        isProcessing, isDeviceDisabled,
        setWidgetValue, closeScreen
    } = props;

    useEffect(() => {
        function handleStopEdit() {
            closeScreen();
        }

        globalEscHandler.register(handleStopEdit);

        return () => {
            globalEscHandler.unregister(handleStopEdit);
        };
    }, []);

    function handleSubmit({ value, name, closeOnSuccess, onError }) {
        if (isProcessing || !isBrokerConnected || isDeviceDisabled) return;

        try {
            setWidgetValue({
                topic : name,
                value,
                onError
            });

            if (closeScreen && closeOnSuccess) closeScreen();
        } catch (error) {
            // pass
            console.error('Edit widget value error: ', { error });
        }
    }

    return (
        <div className={styles.EditWidgetScreen}>
            <div className={styles.content}>
                { REAL_TIME_WIDGETS.includes(widgetToEdit?.type)
                    ? (
                        <RealTimeScreen
                            {...props}
                            onSubmit = {handleSubmit}
                        />
                    ) : (
                        <ControlledScreen
                            {...props}
                            onSubmit = {handleSubmit}
                        />
                    )
                }
            </div>
        </div>
    );
}

EditWidgetScreen.propTypes = {
    closeScreen    : PropTypes.func.isRequired,
    setWidgetValue : PropTypes.func.isRequired,
    widgetToEdit   : PropTypes?.shape({
        type  : PropTypes.string,
        name  : PropTypes.string,
        value : PropTypes.string
    }),
    isProcessing      : PropTypes.bool.isRequired,
    processingTopics  : PropTypes.arrayOf(PropTypes.string).isRequired,
    isBrokerConnected : PropTypes.bool,
    isDeviceDisabled  : PropTypes.bool,
    themeMode         : PropTypes.string,
    t                 : PropTypes.func
};

EditWidgetScreen.defaultProps = {
    widgetToEdit      : void 0,
    themeMode         : '',
    isBrokerConnected : false,
    isDeviceDisabled  : false,
    t                 : (text) => text
};

export default EditWidgetScreen;

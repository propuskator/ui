import React, {
    useCallback,
    useMemo,
    useState
}                from 'react';
import PropTypes from 'prop-types';

import {
    DragDropContext,
    Droppable,
    Draggable
}                from 'react-beautiful-dnd';

import Widget    from '../Widget';

import styles    from './WidgetsList.less';

function WidgetsList(props) {
    const {
        smartHome, setWidgetValue, t,
        widgets, onDelete, openModal, closeModal, isDeviceDisabled,
        addToast, onChange, onChangeOrder, openWidgetScreen, phoneMode,
        isBrokerConnected, isEditMode, forwardRef, className, deviceId, themeMode
    } = props;

    const [ isDragDisabled, setIsDragDisabled ] = useState(false);

    const memoList = useMemo(() => widgets.map((widget, index) => {
        const selectedTopic = widget?.topics?.[0] || '';
        const { instance = {} } = isBrokerConnected ? smartHome?.getInstanceByTopic(selectedTopic) || {} : {};
        const values = widget?.topics?.map(topic => smartHome?.getInstanceByTopic(topic)?.instance?.value);

        return (
            <Draggable
                draggableId    = {widget?.id}
                isDragDisabled = {!isEditMode || isDragDisabled}
                index          = {index}
                key            = {widget?.id || index}
            >
                { provided => (
                    <div
                        ref = {provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Widget
                            setWidgetValue    = {setWidgetValue}
                            value             = {instance?.value || ''}
                            values            = {values}
                            onDelete          = {onDelete}
                            openModal         = {openModal}
                            closeModal        = {closeModal}
                            addToast          = {addToast}
                            onChange          = {onChange}
                            openWidgetScreen  = {openWidgetScreen}
                            setIsDragDisabled = {setIsDragDisabled}
                            isEditMode        = {isEditMode}
                            settable          = {instance?.settable === 'true'}
                            isBrokerConnected = {isBrokerConnected}
                            isDeviceDisabled  = {isDeviceDisabled}
                            dataType          = {instance?.dataType}
                            format            = {instance?.format}
                            phoneMode         = {phoneMode}
                            themeMode         = {themeMode}
                            deviceId          = {deviceId}
                            key               = {widget?.id}
                            t                 = {t}
                            {...widget}
                        />
                    </div>)
                }
            </Draggable>
        );
    }), [
        widgets, deviceId,
        isEditMode, isBrokerConnected, isDeviceDisabled, phoneMode
    ]);

    const handleDragEnd = useCallback(({ source, destination }) => {
        if (source && destination && source !== destination) {
            onChangeOrder(source.index, destination.index);
        }
    }, [ onChangeOrder ]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className={className} ref={forwardRef}>
                <Droppable droppableId='droppableList'>
                    { provided => (
                        <div
                            ref       = {provided.innerRef}
                            className = {styles.draggableItem}
                            {...provided.droppableProps}
                        >
                            {memoList}
                            {provided.placeholder}
                        </div>)
                    }
                </Droppable>
            </div>
        </DragDropContext>
    );
}

WidgetsList.propTypes = {
    className         : PropTypes.string,
    phoneMode         : PropTypes.string,
    themeMode         : PropTypes.string,
    widgets           : PropTypes.array.isRequired,
    onChangeOrder     : PropTypes.func.isRequired,
    onDelete          : PropTypes.func,
    openModal         : PropTypes.func,
    closeModal        : PropTypes.func,
    addToast          : PropTypes.func,
    onChange          : PropTypes.func,
    openWidgetScreen  : PropTypes.func,
    isBrokerConnected : PropTypes.bool,
    isDeviceDisabled  : PropTypes.bool,
    deviceId          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isEditMode        : PropTypes.bool,
    setWidgetValue    : PropTypes.func,
    forwardRef        : PropTypes.shape({
        current : PropTypes.shape({})
    }),
    smartHome : PropTypes.object,
    t         : PropTypes.func
};

WidgetsList.defaultProps = {
    className         : '',
    phoneMode         : '',
    themeMode         : '',
    onDelete          : void 0,
    openModal         : void 0,
    closeModal        : void 0,
    addToast          : void 0,
    onChange          : void 0,
    openWidgetScreen  : void 0,
    isDeviceDisabled  : false,
    isBrokerConnected : false,
    isEditMode        : false,
    forwardRef        : void 0,
    deviceId          : void 0,
    setWidgetValue    : void 0,
    smartHome         : void 0,
    t                 : (text) => text
};


export default WidgetsList;

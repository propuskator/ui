import React, {
    useState,
    useEffect
}                         from 'react';
import PropTypes          from 'prop-types';

import InputNumber        from '../../../../../base/Input/InputNumber';
import Input              from '../../../../../base/Input';
import Switch             from '../../../../../base/Switch';
import Button             from '../../../../../base/Button';
import globalEnterHandler from '../../../../../../utils/eventHandlers/globalEnterHandler';

import styles             from '../EditWidgetScreen.less';

function getTopicsValue(smartHome, topics = []) {
    if (!smartHome) return void 0;

    // eslint-disable-next-line prefer-spread/prefer-object-spread
    return Object.assign({}, ...topics.map(topic => {
        const { instance } = smartHome?.getInstanceByTopic(topic);

        return { [topic]: instance?.value };
    }));
}

function ControlledScreen(props) {
    const {
        widgetToEdit, isProcessing,
        isDeviceDisabled, isBrokerConnected,
        onSubmit, themeMode, t, smartHome
    } = props;

    const {
        id,
        type,
        dataType,
        topics = []
    } = widgetToEdit || {};

    const [ state, setState ] = useState({
        formData : {},
        errors   : {}
    });

    useEffect(() => {
        setState({
            formData : getTopicsValue(smartHome, topics),
            errors   : {}
        });
    }, []);

    useEffect(() => {
        function handleEnterPress() {
            handleSubmit();
        }

        globalEnterHandler.register(handleEnterPress);

        return () => {
            globalEnterHandler.unregister(handleEnterPress);
        };
    }, [ state ]);

    function handleChangeField({ name, value }) {
        setState(prev => ({
            ...prev,
            formData : {
                ...(prev?.formData || {}),
                [name] : `${value}`
            },
            errors : {
                ...(prev?.errors || {}),
                [name] : ''
            }
        }));
    }

    function handleSubmit() {
        Object.entries(state?.formData).forEach(([ name, value ]) => {
            onSubmit({ name, value, closeOnSuccess: true });
        });
    }

    function renderEditWidget() {
        const { formData } = state;

        const value = formData?.[topics[0]];

        const InputComponent = [ 'integer', 'float' ].includes(dataType)
            ? InputNumber
            : Input;

        switch (type) {
            case 'toggle':
                return (
                    <Switch
                        value        = {`${value}` === 'true'}
                        onChange     = {handleChangeField}
                        name         = {topics[0] || ''}
                        isProcessing = {isProcessing}
                        isDisabled   = {isProcessing}
                    />
                );
            default:
                return (
                    <InputComponent
                        key            = {id}
                        value          = {value || ''}
                        type           = {dataType}
                        onChange       = {handleChangeField}
                        name           = {topics[0] || ''}
                        className      = {styles.inputField}
                        label          = {t('translation:Value')}
                        isInvalid      = {state?.errors?.value}
                        disabled       = {isProcessing}
                        themeMode      = {themeMode}
                        floatPrecision = {3}
                        withClearButton
                        autoFocus
                    />
                );
        }
    }

    return (
        type
            ? (
                <>
                    {renderEditWidget()}

                    <div className={styles.footer}>
                        <Button
                            className  = {styles.submitButton}
                            onClick    = {handleSubmit}
                            isDisabled = {!isBrokerConnected || isDeviceDisabled}
                            isLoading  = {isProcessing}
                        >
                            {t('layout-page:Save changes')}
                        </Button>
                    </div>
                </>
            ) : null
    );
}

ControlledScreen.propTypes = {
    widgetToEdit      : PropTypes.shape({}).isRequired,
    themeMode         : PropTypes.string,
    isProcessing      : PropTypes.bool,
    isBrokerConnected : PropTypes.bool,
    isDeviceDisabled  : PropTypes.bool,
    onSubmit          : PropTypes.func.isRequired,
    t                 : PropTypes.func,
    smartHome         : PropTypes.object
};

ControlledScreen.defaultProps = {
    themeMode         : '',
    isProcessing      : false,
    isBrokerConnected : false,
    isDeviceDisabled  : false,
    t                 : t => t,
    smartHome         : void 0
};

export default ControlledScreen;

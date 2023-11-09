/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import React, {
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Tabs                     from 'templater-ui/src/components/shared/Tabs';
import Typography               from 'templater-ui/src/components/base/Typography';
import IconButton               from 'templater-ui/src/components/base/IconButton';
import Button                   from 'templater-ui/src/components/base/Button';

import PropertiesList           from 'Shared/Properties/PropertiesList';
import SvgIcon                  from 'Base/SvgIcon';

import { TOASTS_KEYS }          from 'Constants/toasts';

import {
    OPTIONS_PROPERTIES_WITH_VISIBILITY,
    RELAY_PROPERTIES_WITH_VISIBILITY
}                               from './data.js';

import styles                   from './DeviceSettings.less';

const cx = classnames.bind(styles);

function DeviceSettings(props) {
    const {
        closeModal, level, isTopModal, name,
        onClose, entityName, accessTokenReaderId,
        options, telemetry, firmwareSensors,
        displayedTopics, relays, setDoorState, addToast, t
    } = props;

    useEffect(() => {
        return () => {
            if (onClose) onClose();
        };
    }, []);

    function handleCloseModal() {
        closeModal(name);
    }

    function handleToggleReader(doorStateData) {
        return () => {
            if (!doorStateData) return;
            const { topic, readerName, value } = doorStateData;
            const isDoorOpen = value === 'true';

            setDoorState({
                topic,
                value   : !isDoorOpen,
                onError : () => addToast({
                    key     : TOASTS_KEYS.accessTokenReaderDoorState,
                    title   : t('Something went wrong'),
                    message : (
                        <div >
                            {t('readers-page:Access point')}<b> { readerName } </b>{isDoorOpen ? t('readers-page:hasn\'t been closed') : t('readers-page:hasn\'t been opened')}
                        </div>
                    ),
                    type : 'error'
                })
            });
        };
    }

    function renderOpenDoorButton(doorStateData) {
        const { isValueProcessing, value } = doorStateData;
        const isDoorOpen = value === 'true';

        return (
            <Button
                className  = {styles.doorStatusControl}
                isLoading  = {isValueProcessing}
                onClick    = {handleToggleReader(doorStateData)}
                isDisabled = {!value}
                size       = 'S'
                color      = {isDoorOpen ? 'red' : 'openButton'}
            >
                {isDoorOpen ? t('Close') : t('Open')}
                <SvgIcon
                    type      = {isDoorOpen ? 'lockOpened' : 'lock'}
                    className = {styles.lockIcon}
                    color     = 'white'
                />
            </Button>
        );
    }

    function renderContent() {
        const isOptionsEmpty = !options?.length;
        const isTelemetryEmpty = !telemetry?.length;
        const isFirmwareSensorsEmpty = !firmwareSensors?.length;
        const isRelaysEmpty = !relays?.length;

        const tabs = [];

        if (!isOptionsEmpty) {
            tabs.push({
                label   : t('readers-page:Options'),
                id      : 'options',
                content : (
                    <PropertiesList
                        className           = {styles.tabContent}
                        properties          = {options}
                        displayedTopics     = {displayedTopics}
                        accessTokenReaderId = {accessTokenReaderId}
                        propertyIdsWithVisibility = {OPTIONS_PROPERTIES_WITH_VISIBILITY}
                    />
                )
            });
        }
        if (!isTelemetryEmpty) {
            tabs.push({
                label   : t('readers-page:Telemetry'),
                id      : 'telemetry',
                content : (
                    <PropertiesList
                        className  = {styles.tabContent}
                        properties = {telemetry?.map(item => ({ ...item, withCopyControl: true }))}
                    />
                )
            });
        }
        if (!isFirmwareSensorsEmpty) {
            tabs.push({
                label   : t('readers-page:Firmware'),
                id      : 'firmwareSensors',
                content : (
                    <PropertiesList
                        className  = {styles.tabContent}
                        properties = {firmwareSensors}
                    />
                )
            });
        }
        if (!isRelaysEmpty) {
            const relayProperties = relays.map(item => item?.withCustomComponent ?
                { ...item, renderCustomComponent: renderOpenDoorButton }
                : item);

            tabs.push({
                label   : t('readers-page:Relays'),
                id      : 'relays',
                content : (
                    <PropertiesList
                        className           = {styles.tabContent}
                        properties          = {relayProperties}
                        displayedTopics     = {displayedTopics}
                        accessTokenReaderId = {accessTokenReaderId}
                        propertyIdsWithVisibility = {RELAY_PROPERTIES_WITH_VISIBILITY}
                    />
                )
            });
        }

        return (
            <Tabs
                tabs            = {tabs}
                classes         = {{
                    tabsContainer : styles.tabsContainer,
                    tabsWrapper   : styles.tabsWrapper
                }}
                emptyMessage   = {t('readers-page:No settings to display')}
            />
        );
    }

    const isEmpty = !options?.length && !telemetry?.length && !firmwareSensors.length;
    const deviceSettingsCN = cx(styles.DeviceSettings, {
        [`${level}Level`] : level,
        topModal          : isTopModal,
        empty             : isEmpty
    });

    return (
        <div className={deviceSettingsCN}>
            <div className={styles.content}>
                <Typography
                    className = {styles.title}
                    variant   = 'headline3'
                    color     = 'black'
                >
                    {t('readers-page:Access point settings')} &quot;{entityName}&quot;
                </Typography>
                <IconButton
                    iconType  = 'cross'
                    className = {styles.closeButton}
                    onClick   = {handleCloseModal}
                />
                <div className={styles.mainDataWrapper}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

DeviceSettings.propTypes = {
    entityName          : PropTypes.string,
    accessTokenReaderId : PropTypes.string,
    name                : PropTypes.string,
    onClose             : PropTypes.func,
    options             : PropTypes.arrayOf(PropTypes.shape({})),
    telemetry           : PropTypes.arrayOf(PropTypes.shape({})),
    firmwareSensors     : PropTypes.arrayOf(PropTypes.shape({})),
    relays              : PropTypes.arrayOf(PropTypes.shape({})),
    displayedTopics     : PropTypes.arrayOf(PropTypes.string),
    closeModal          : PropTypes.func,
    isTopModal          : PropTypes.bool,
    level               : PropTypes.oneOf([ 'first' ]),
    addToast            : PropTypes.func.isRequired,
    setDoorState        : PropTypes.func.isRequired,
    t                   : PropTypes.func.isRequired
};

DeviceSettings.defaultProps = {
    name                : '',
    accessTokenReaderId : '',
    entityName          : '',
    options             : void 0,
    telemetry           : void 0,
    firmwareSensors     : void 0,
    relays              : void 0,
    displayedTopics     : void 0,
    isTopModal          : false,
    level               : 'first',
    closeModal          : void 0,
    onClose             : void 0
};

export default DeviceSettings;

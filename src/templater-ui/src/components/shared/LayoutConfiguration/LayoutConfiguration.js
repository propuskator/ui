/* eslint-disable  babel/no-unused-expressions */
import React, {
    useState,
    useEffect,
    useRef
}                                from 'react';
import classnames                from 'classnames/bind';
import PropTypes                 from 'prop-types';

import CriticalValue             from '../../base/CriticalValue';
import Button                    from '../../base/Button';
import IconButton                from '../../base/IconButton/IconButton';
import Tooltip                   from '../../base/Tooltip';
import { Fade }                  from '../../../utils/animations';
import { TOASTS_KEYS }           from '../../../constants/toasts';
import {
    LAYOUT_CONTENT_ID,
    DEFULT_LAYOUTS_CONFIG
}                                from '../../../constants/layouts';
import SvgIcon                   from '../../base/SvgIcon';
import DeviceStatus              from '../DeviceStatus';
import WidgetScreen              from './WidgetScreen';
import ProductsScreen            from './ProductsScreen';

import TabTitle                 from './TabTitle';
import WidgetsList              from './WidgetsList';
import WidgetsTabs              from './WidgetsTabs';

import styles                   from './LayoutConfiguration.less';

const cx = classnames.bind(styles);

let timeout = null;

const VIEW_MODE_WIDGETS = [ 'gauge', 'number' ];

function LayoutConfiguration(props) {   // eslint-disable-line max-lines-per-function
    const {
        smartHome, setWidgetValue,
        openModal, closeModal, addToast, removeToastByKey, phoneMode,
        isEditMode, forwardRef, isProcessing, initialState,
        device, deviceId, t, fetchProducts, layoutId, productData, themeMode,
        isDeviceExist, productVersion, productStatus,
        fetchPeriods, fetchIntervals, fetchTimeline,
        checkProductVersion, productTitle
    } = props;

    const isDeviceDisabled = [ 'disconnected', 'lost', 'alert' ]?.includes(device?.state);
    const isBrokerConnected = isDeviceExist && props?.isBrokerConnected;

    const widgetsListRef = useRef({});
    const tabsRef        = useRef({});
    const [ state, setState ] = useState(initialState || DEFULT_LAYOUTS_CONFIG);
    const [ activeScreen, setActiveScreen ] = useState();
    const [ productsData, setProductsData ] = useState({
        isFetching : !productData,
        list       : [ productData ]
    });

    const tabs = state?.tabs;
    const isSingleTab = tabs?.length === 1;

    useEffect(() => {
        if (forwardRef && 'current' in forwardRef) {
            forwardRef.current = {
                getState : () => state
            };
        }

        return () => {
            removeToastByKey(TOASTS_KEYS.widgetUpdate);
        };
    }, [ state ]);

    useEffect(() => {
        if (productData) {
            setProductsData({ isFetching: false, list: [ productData ] });
        } else {
            loadProducts();

            return () => timeout && clearTimeout(timeout);
        }
    }, [ productData ]);

    useEffect(() => {
        if (!device && activeScreen?.key === 'productsScreen') setActiveScreen(void 0);
    }, [ device ]);

    async function loadProducts() {
        if (!layoutId) {
            return setProductsData(() => ({
                isFetching : false,
                list       : []
            }));
        }
        if (!fetchProducts) return;

        try {
            const { data } = await fetchProducts({
                layout_id : layoutId
            });

            setProductsData(() => ({
                isFetching : false,
                list       : data?.map(item => ({ ...item, productStatus }))
            }));
        } catch (error) {
            console.error('Products fetch error', { error });

            setProductsData(() => ({
                isFetching : false,
                list       : []
            }));
        }
    }

    function handleAddWidget(tabTitle) {
        return () => {
            if (isProcessing || !isBrokerConnected) return;

            openModal('layoutWidget', {
                isCreateEntity : true,
                deviceId,
                onSuccess      : (widget) => {
                    setState(prev => ({
                        ...prev,
                        tabs : (prev?.tabs || [])?.map(tabData => ({
                            ...tabData,
                            widgets : tabData?.title === tabTitle
                                ? [ ...(tabData?.widgets || []), widget?.id ]
                                : tabData?.widgets
                        })),
                        widgets : [
                            ...(prev?.widgets || []),
                            widget
                        ]
                    }));

                    const list = widgetsListRef?.current?.firstChild;

                    if (list) {
                        list?.lastChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        };
    }

    function handleChangeWidget(id, widget) {
        if (isProcessing) return;

        setState(prev => ({
            ...prev,
            widgets : (prev?.widgets || [])?.map(entity => {
                return entity?.id !== id ? entity : widget;
            })
        }));
    }

    function handleDeleteWidget(widgetId) {
        if (isProcessing) return;
        if (!widgetId) return;

        setState(prev => ({
            ...prev,
            tabs : (prev?.tabs || []).map(tab => ({
                ...tab,
                widgets : (tab?.widgets || [])?.includes(widgetId)
                    ? (tab?.widgets || []).filter(id => id !== widgetId)
                    : tab?.widgets || []
            })),
            widgets : (prev?.widgets || []).filter(widget => widget?.id !== widgetId)
        }));
    }

    function handleOpenWidgetScreen(widget) {
        if (!isBrokerConnected) return;

        setActiveScreen({
            key  : 'widgetScreen',
            data : widget
        });
    }

    function handleOpenProductsScreen() {
        setActiveScreen({
            key : 'productsScreen'
        });
    }

    function handleCloseScreen() {
        // if (!isBrokerConnected) return;

        setActiveScreen();
    }

    function handleDeleteTab(tabId) {
        if (tabs.length === 1) return;

        const tabData = tabs?.find(tab => tab?.title === tabId);
        const filteredTabs = (tabs || [])?.filter(tab => tab?.title !== tabId);

        if (tabsRef?.current?.setActiveTab) {
            tabsRef.current.setActiveTab(filteredTabs[0]?.title);
        }

        setState(prev => ({
            ...prev,
            tabs    : filteredTabs,
            widgets : (prev?.widgets || [])?.filter(widget => !tabData?.widgets?.includes(widget?.id))
        }));
    }

    function handleAddTab() {
        const tabsNames = tabs?.map(tabData => tabData?.title);
        let tabIndex = 1;
        let uniqueName = '';

        while (!uniqueName) {
            const name = t('layout-page:New Tab', { tabIndex });

            if (tabsNames?.includes(name)) tabIndex++;
            else uniqueName = name;
        }

        setState(prev => ({
            ...prev,
            tabs : [ ...(prev?.tabs || []), { title: uniqueName, widgets: [] } ]
        }));

        timeout = setTimeout(() => {
            if (tabsRef?.current?.setActiveTab) {
                tabsRef.current.setActiveTab(uniqueName);
            }
        }, 200);    // eslint-disable-line no-magic-numbers
    }

    function handleChangeTabTitle(tabId, title) {
        const updatedTabsData = tabs?.map(tab => ({
            ...tab,
            title : tab?.title === tabId ? title : tab?.title
        }));

        setState(prev => ({
            ...prev,
            tabs : updatedTabsData
        }));

        if (tabsRef?.current?.setActiveTab) {
            tabsRef.current.setActiveTab(title);
        }
    }

    function handleChangeWidgetOrder(tabId) {
        const tabData = tabs?.find(tab => tab?.title === tabId);

        return (src, dest) => {
            if (!tabData) return;
            const tabWidgets = tabData?.widgets;
            const newWidgets = tabWidgets.splice(dest, 0, tabWidgets.splice(src, 1)[0]);

            setState(prev => {
                return {
                    ...prev,
                    tabs : tabs?.map(tab => tab?.id !== tabId
                        ? tab
                        : { ...tab, widgets: newWidgets })
                };
            });
        };
    }

    function handleChangeTabsOrder(tabId, src, dest) {
        const tabData = tabs?.find(tab => tab?.title === tabId);

        if (!tabData) return;

        const _tabs = [ ...tabs ];

        _tabs.splice(dest, 0, _tabs.splice(src, 1)[0]);

        setState(prev => ({
            ...prev,
            tabs : _tabs
        }));
    }

    function renderTabContent(tabId) {
        const tabData = tabs?.find(tab => tab?.title === tabId);

        if (!tabData) return null;
        const widgets = tabData?.widgets
            ?.map(widgetId => state?.widgets?.find(widget => widget?.id === widgetId))
            ?.filter(widget => !!widget);

        return (
            <>
                <WidgetsList
                    className         = {styles.widgetsList}
                    widgets           = {widgets}
                    onDelete          = {handleDeleteWidget}
                    openModal         = {openModal}
                    closeModal        = {closeModal}
                    addToast          = {addToast}
                    onChange          = {handleChangeWidget}
                    openWidgetScreen  = {handleOpenWidgetScreen}
                    onChangeOrder     = {handleChangeWidgetOrder(tabId)}
                    isBrokerConnected = {isBrokerConnected}
                    isDeviceDisabled  = {isDeviceDisabled}
                    isEditMode        = {isEditMode}
                    forwardRef        = {widgetsListRef}
                    phoneMode         = {phoneMode}
                    themeMode         = {themeMode}
                    deviceId          = {deviceId}
                    smartHome         = {smartHome}
                    setWidgetValue    = {setWidgetValue}
                    t                 = {t}
                />
                { isEditMode
                    ? (
                        <div className={styles.controlsWrapper}>
                            <Button
                                className  = {cx(styles.addWidgetBtn, 'abort-submit')}
                                onClick    = {isBrokerConnected ? handleAddWidget(tabId) : void 0}
                                isDisabled = {!isBrokerConnected || !isDeviceExist}
                            >
                                {t('layout-page:Add Widget')}
                            </Button>
                        </div>
                    ) : null
                }
            </>
        );
    }

    function renderTabTitle(title) {
        return (
            <TabTitle
                key               = {title}
                className         = {styles.title}
                tabId             = {title}
                tabs              = {tabs}
                isSingleTab       = {isSingleTab}
                isEditMode        = {isEditMode}
                isProcessing      = {isProcessing}
                isBrokerConnected = {isBrokerConnected}
                onDeleteTab       = {handleDeleteTab}
                onChangeTitle     = {handleChangeTabTitle}
                openModal         = {openModal}
                closeModal        = {closeModal}
                t                 = {t}
            />
        );
    }

    function renderWidgetScreen() {
        const screenMode = VIEW_MODE_WIDGETS.includes(activeScreen?.data?.type) ? 'view' : 'edit';

        return (
            <WidgetScreen
                smartHome           = {smartHome}
                setWidgetValue      = {setWidgetValue}
                mode                = {screenMode}
                widgetData          = {activeScreen?.data}
                closeWidgetScreen   = {handleCloseScreen}
                isBrokerConnected   = {isBrokerConnected}
                isDeviceDisabled    = {isDeviceDisabled}
                themeMode           = {themeMode}
                t                   = {t}
                fetchPeriods        = {fetchPeriods}
                fetchIntervals      = {fetchIntervals}
                fetchTimeline       = {fetchTimeline}
            />
        );
    }

    function renderProductsScreen() {
        return (
            <ProductsScreen
                closeWidgetScreen   = {handleCloseScreen}
                isBrokerConnected   = {isBrokerConnected}
                products            = {productsData?.list?.map(product => ({
                    ...product,
                    // сейчас максимум 1 продукт на скрине
                    // если будет больше то нужно чтобы бекенд возвращал версии для них
                    version : productVersion
                }))}
                isFetching          = {productsData?.isFetching}
                t                   = {t}
                device              = {device}
                phoneMode           = {phoneMode}
                themeMode           = {themeMode}
                checkProductVersion = {checkProductVersion}
            />
        );
    }

    const tabsList = tabs?.map(tabData => ({
        label   : tabData?.title,
        id      : tabData?.title,
        content : renderTabContent(tabData?.title)
    })) || [];

    const layoutConfigurationCN = cx(styles.LayoutConfiguration, {
        [`${phoneMode}Mode`] : phoneMode,
        editMode             : isEditMode,
        processing           : isProcessing
    });

    const contentCN = cx(styles.content, {
        [`${themeMode}Theme`] : themeMode
    });

    return (
        <div className={layoutConfigurationCN}>
            <div className={contentCN} id={LAYOUT_CONTENT_ID}>
                <Fade
                    visible = {activeScreen?.key === 'productsScreen'}
                    mountOnEnter
                    appear
                >
                    {renderProductsScreen()}
                </Fade>

                {activeScreen?.key === 'widgetScreen' ? renderWidgetScreen() : null}
                <div className={styles.headerWrapper}>
                    {
                        device && activeScreen?.key !== 'productsScreen'
                            ? (
                                <div className={styles.productsScreenLink}>
                                    <Tooltip
                                        title      = {t('Products')}
                                        classes    = {{ tooltip: styles.tooltip }}
                                        isDisabled = {!isBrokerConnected}
                                    >
                                        <div>
                                            <IconButton
                                                iconType   = 'arrowRightThin'
                                                className  = {styles.control}
                                                onClick    = {handleOpenProductsScreen}
                                            />
                                        </div>
                                    </Tooltip>
                                </div>
                            )
                            : null
                    }
                    <div className={styles.titleWrapper}>
                        <DeviceStatus
                            t               = {t}
                            status          = {device?.state}
                            productVersion  = {productVersion}
                            productStatus   = {productStatus}
                            firmwareVersion = {checkProductVersion ? device?.firmwareVersion : void 0}
                        />
                        <CriticalValue
                            className  = {styles.title}
                            value      = {productTitle || t('layout-page:Product UI')}
                            maxWidth   = {'calc(100% - 14px)'}
                            isDisabled = {!isBrokerConnected}
                        />
                    </div>
                    { isEditMode
                        ? (
                            <div
                                className = {styles.addTabControl}
                                onClick   = {handleAddTab}
                            >
                                <SvgIcon type='plusRound' className={styles.plusIcon} />
                                <div className={styles.label}>{t('layout-page:Add tab')}</div>
                            </div>
                        ) : null
                    }
                </div>
                { activeScreen?.key !== 'productsScreen'
                    ? (
                        <WidgetsTabs
                            tabs             = {tabsList}
                            isDragDisabled   = {!isEditMode || isSingleTab}
                            onChangeOrder    = {handleChangeTabsOrder}
                            renderTab        = {renderTabTitle}
                            themeMode        = {themeMode}
                            classes          = {{
                                tabsContainer : styles.tabsContainer,
                                tabsWrapper   : styles.tabsWrapper,
                                tabs          : cx(styles.tabs, { single: isSingleTab }),
                                tab           : styles.tab,
                                content       : styles.tabContent,
                                indicator     : styles.indicator
                            }}
                            forwardRef      = {tabsRef}
                            t               = {t}
                        />
                    ) : null
                }
            </div>
            <div className={styles.phoneBgIcon} />
        </div>
    );
}

LayoutConfiguration.propTypes = {
    openModal         : PropTypes.func.isRequired,
    closeModal        : PropTypes.func.isRequired,
    addToast          : PropTypes.func.isRequired,
    removeToastByKey  : PropTypes.func.isRequired,
    productVersion    : PropTypes.string,
    productStatus     : PropTypes.string,
    deviceId          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    layoutId          : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isBrokerConnected : PropTypes.bool, // eslint-disable-line  react/no-unused-prop-types
    isEditMode        : PropTypes.bool,
    isDeviceExist     : PropTypes.bool.isRequired,
    forwardRef        : PropTypes.shape({
        current : PropTypes.shape({ })
    }),
    initialState : PropTypes.shape({}),
    productData  : PropTypes.shape({
        title         : PropTypes.string,
        icon          : PropTypes.string,
        productStatus : PropTypes.string
    }),
    isProcessing        : PropTypes.bool,
    device              : PropTypes.shape({}),
    phoneMode           : PropTypes.oneOf([ 'iphone', 'android' ]),
    themeMode           : PropTypes.oneOf([ 'light', 'dark' ]),
    t                   : PropTypes.func,
    fetchProducts       : PropTypes.func,
    setWidgetValue      : PropTypes.func,
    fetchPeriods        : PropTypes.func,
    fetchIntervals      : PropTypes.func,
    fetchTimeline       : PropTypes.func,
    smartHome           : PropTypes.object.isRequired,
    checkProductVersion : PropTypes.bool,
    productTitle        : PropTypes.string
};

LayoutConfiguration.defaultProps = {
    isEditMode          : true,
    isBrokerConnected   : false,
    productVersion      : '',
    productStatus       : '',
    t                   : (text) => text,
    deviceId            : void 0,
    layoutId            : void 0,
    device              : void 0,
    forwardRef          : void 0,
    initialState        : void 0,
    productData         : void 0,
    isProcessing        : false,
    fetchProducts       : void 0,
    phoneMode           : 'iphone',
    themeMode           : 'light',
    fetchPeriods        : void 0,
    fetchIntervals      : void 0,
    fetchTimeline       : void 0,
    setWidgetValue      : void 0,
    checkProductVersion : true,
    productTitle        : ''
};

export default LayoutConfiguration;

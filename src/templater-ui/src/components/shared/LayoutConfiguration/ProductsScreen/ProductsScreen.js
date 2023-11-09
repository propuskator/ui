/* eslint-disable react/jsx-indent */
import React, {
    useEffect
}                           from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import globalEscHandler     from '../../../../utils/eventHandlers/globalEscHandler';
import Loader               from '../../../base/Loader';
import CriticalValue        from '../../../base/CriticalValue';
import Image                from '../../../base/Image';
import SvgIcon              from '../../../base/SvgIcon';
import Typography           from '../../../base/Typography';
import EmptyList            from '../../../shared/EmptyList';
import DeviceStatus         from '../../../shared/DeviceStatus';
import { getDeviceStatusMeta } from '../../../shared/DeviceStatus/utils';

import { ReactComponent as FavoriteIcon }      from '../../../../assets/icons/mobileEmulator/favorite.svg';
import { ReactComponent as DevicesIcon }       from '../../../../assets/icons/mobileEmulator/devices.svg';
import { ReactComponent as SettingsIcon }      from '../../../../assets/icons/mobileEmulator/settings.svg';
import { ReactComponent as BellIcon }          from '../../../../assets/icons/mobileEmulator/bell.svg';
import { ReactComponent as SearchIcon }        from '../../../../assets/icons/mobileEmulator/search.svg';

import styles                  from './ProductsScreen.less';

const cx = classnames.bind(styles);

const MENU_TABS = [ {
    label    : 'Favorite',
    type     : 'favorite',
    icon     : FavoriteIcon,
    isActive : false
}, {
    label    : 'Devices',
    type     : 'devices',
    icon     : DevicesIcon,
    isActive : true
}, {
    label    : 'Settings',
    type     : 'settings',
    icon     : SettingsIcon,
    isActive : false
} ];

function ProductScreen(props) { // eslint-disable-line max-lines-per-function
    const {
        products, closeWidgetScreen, isBrokerConnected, t,
        isFetching, device, phoneMode, themeMode,
        checkProductVersion
    } = props;

    useEffect(() => {
        function handleEscPress() {
            closeWidgetScreen();
        }

        globalEscHandler.register(handleEscPress);

        return () => {
            globalEscHandler.unregister(handleEscPress);
        };
    }, []);

    function renderProductIconFallback() {
        return (
            <div className = {styles.fallbackProductIcon}>
                <SvgIcon type='product' color='primaryGreen' className={styles.icon} />
            </div>
        );
    }

    function renderProducts() {
        if (!products?.length) return null;

        return (
            <div className={styles.productsList}>
                { products?.map(product => {
                    const { processStatus, color } = getDeviceStatusMeta({
                        status          : device?.state,
                        productVersion  : product?.version,
                        productStatus   : product?.productStatus,
                        firmwareVersion : checkProductVersion ? device?.firmwareVersion : void 0
                    });

                    return (
                        <div
                            key       = {product?.id}
                            className = {styles.productBlock}
                            onClick   = {closeWidgetScreen}
                        >
                            <div className={styles.deviceStatusWrapper}>
                                <CriticalValue
                                    className = {styles.statusText}
                                    color     = {color}
                                    value     = {processStatus}
                                    maxWidth  = {'100%'}
                                />
                                <DeviceStatus
                                    t               = {t}
                                    status          = {device?.state}
                                    withTooltip     = {false}
                                    productVersion  = {product?.version}
                                    productStatus   = {product?.productStatus}
                                    firmwareVersion = {device?.firmwareVersion}
                                    withIndicator   = {false}
                                />
                            </div>
                            <div className={styles.imageWrapper}>
                                { product?.icon
                                    ? (
                                        <Image
                                            src               = {product?.icon}
                                            withResize        = {false}
                                            className         = {styles.avatarPreview}
                                            FallbackComponent = {renderProductIconFallback()}
                                            LoaderComponent = {(
                                                <div className={styles.loaderWrapper}>
                                                    <Loader size='XS' />
                                                </div>
                                            )}
                                        />
                                    ) : renderProductIconFallback()
                                }
                            </div>
                            <CriticalValue
                                className  = {styles.productTitle}
                                value      = {product?.title}
                                maxWidth   = {'90%'}
                                isDisabled = {!isBrokerConnected}
                            />
                        </div>
                    );
                }) }
            </div>
        );
    }

    function renderHeading() {
        return (
            <div className={styles.headingWrapper}>
                <div className={styles.iconsWrapper}>
                    <SvgIcon
                        className = {styles.headingIcon}
                        color     = {themeMode === 'dark' ? 'white' : ''}
                        svg       = {BellIcon}
                    />
                    <SvgIcon
                        className = {styles.headingIcon}
                        color     = {themeMode === 'dark' ? 'white' : ''}
                        svg       = {SearchIcon}
                    />
                </div>
                <Typography className={styles.headingTitle}>
                    {t('Devices')}
                </Typography>
            </div>
        );
    }

    function renderMenu() {
        return (
            <div className={styles.menuWrapper}>
                { MENU_TABS?.map(tabData => (
                    <div
                        key       = {tabData?.label}
                        className = {cx(styles.menuTab, { active: tabData?.isActive, [styles[tabData?.type]]: true })}
                    >
                        <SvgIcon
                            className = {styles.icon}
                            color     = {tabData?.isActive ? 'primary700' : ''}
                            svg       = {tabData?.icon}
                        />
                        <CriticalValue
                            className  = {styles.menuTabLabel}
                            value      = {t(tabData?.label)}
                            maxWidth   = {'100%'}
                            isDisabled = {!isBrokerConnected}
                        />
                    </div>
                )) }
            </div>
        );
    }

    const productScreenCN = cx(styles.ProductScreen, {
        [`${phoneMode}Mode`]  : phoneMode,
        [`${themeMode}Theme`] : themeMode
    });

    return (
        <div className={productScreenCN}>
            <div className={styles.content}>
                { isFetching && isBrokerConnected
                    ? (
                        <div className={styles.loaderWrapper}>
                            <Loader size = 'S' />
                        </div>
                    ) : null
                }
                { !isFetching && !products?.length
                    ? (
                        <div className = {styles.emptyListWrapper}>
                            <EmptyList iconType='emptyList' size='S'>
                                <div>
                                    {t('There are no products yet')}
                                </div>
                            </EmptyList>
                        </div>
                    ) : null
                }
                { !isFetching && products?.length
                    ? (
                        <div>
                            {renderHeading()}
                            {renderProducts()}
                        </div>
                    )
                    : null
                }
            </div>
            <div className={styles.footer}>
                {renderMenu()}
            </div>
        </div>
    );
}

ProductScreen.propTypes = {
    isBrokerConnected : PropTypes.bool,
    closeWidgetScreen : PropTypes.func.isRequired,
    t                 : PropTypes.func.isRequired,
    isFetching        : PropTypes.bool,
    products          : PropTypes.arrayOf(PropTypes.shape({
    })),
    device : PropTypes.shape({
        state : PropTypes.string
    }),
    themeMode           : PropTypes.string,
    phoneMode           : PropTypes.oneOf([ 'iphone', 'android' ]).isRequired,
    checkProductVersion : PropTypes.bool
};

ProductScreen.defaultProps = {
    isBrokerConnected   : false,
    isFetching          : false,
    products            : void 0,
    device              : void 0,
    themeMode           : '',
    checkProductVersion : true
};

export default ProductScreen;

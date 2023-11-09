import React                                from 'react';
import classnames                           from 'classnames/bind';
import PropTypes                            from 'prop-types';

import Button                               from 'templater-ui/src/components/base/Button';

import { ReactComponent as PlayMarketIcon } from 'Assets/icons/playMarket.svg';
import { ReactComponent as AppleIcon }      from 'Assets/icons/appStore.svg';
import config                               from 'Config';

import styles                               from './AppLinks.less';

const cx = classnames.bind(styles);


function AppLinks(props) {
    const { t, className } = props;

    function handleOpenLink(link) {
        return () => {
            if (!link) return;

            window.open(link, '_blank');
        };
    }

    return (
        <div className={cx(styles.AppLinks, className)} key='links'>
            <div className={cx(styles.linkWrapper)}>
                <div className={styles.description}>
                    <div className={cx(styles.control, styles.appStore)}>
                        <Button
                            className  = {styles.button}
                            color      = 'greyMedium'
                            variant    = 'outlined'
                            size       = 'S'
                            onClick    = {handleOpenLink(config?.links?.appStore)}
                        >
                            <div className={styles.content}>
                                <div className={styles.iconWrapper}>
                                    <AppleIcon className={styles.icon} />
                                </div>
                                <div>
                                    <div className={styles.preTitle}>
                                        {t('Download on the')}
                                    </div>
                                    <div className={styles.title}>
                                        {t('App Store')}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>
                    <div className={cx(styles.control, styles.playMarket)}>
                        <Button
                            className  = {styles.button}
                            color      = 'greyMedium'
                            variant    = 'outlined'
                            size       = 'S'
                            onClick    = {handleOpenLink(config?.links?.playMarket)}
                        >
                            <div className={styles.content}>
                                <div className={styles.iconWrapper}>
                                    <PlayMarketIcon className={styles.icon} />
                                </div>
                                <div>
                                    <div className={styles.preTitle}>
                                        {t('GET IT ON')}
                                    </div>
                                    <div className={styles.title}>
                                        {t('Google Play')}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

AppLinks.propTypes = {
    t         : PropTypes.func,
    className : PropTypes.string
};

AppLinks.defaultProps = {
    t         : (text) => text,
    className : void 0
};

export default AppLinks;

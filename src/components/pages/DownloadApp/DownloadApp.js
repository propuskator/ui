import React from 'react';

import PropTypes from 'prop-types';
import classnames       from 'classnames/bind';

import SvgIcon from 'Base/SvgIcon';
import AppLinks from '../../shared/AppLinks';

import styles from './DownloadApp.less';

const cx = classnames.bind(styles);

const LOGO_TYPE_BY_LANG = {
    'en' : 'logoEN',
    'ru' : 'logoRU',
    'uk' : 'logoUA'
};

function DownloadApp(props) {
    const { className, languageId, t } = props;

    const DownloadAppCN = cx(styles.DownloadApp, { [className]: className });

    return (
        <div className={DownloadAppCN}>
            <div className={styles.content}>
                <SvgIcon
                    type      = {LOGO_TYPE_BY_LANG[languageId]}
                    className = {styles.logo}
                    color     = {'white'}
                />
                <div className={styles.info}>
                    {t('Oops! You don\'t seem to have the Propuskator mobile app')}
                </div>
                <AppLinks
                    className = {styles.appLinks}
                    t         = {t}
                />
            </div>
            <SvgIcon
                type      = {'sadMobile'}
                className = {styles.sadMobileIcon}
            />
        </div>
    );
}

DownloadApp.propTypes = {
    className  : PropTypes.string,
    languageId : PropTypes.string,
    t          : PropTypes.func
};

DownloadApp.defaultProps = {
    className  : '',
    languageId : 'en',
    t          : (text) => text
};

export default DownloadApp;

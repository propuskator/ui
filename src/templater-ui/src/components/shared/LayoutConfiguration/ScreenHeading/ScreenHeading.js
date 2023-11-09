import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Tooltip          from '../../../base/Tooltip';
import IconButton       from '../../../base/IconButton/IconButton';
import CriticalValue    from '../../../base/CriticalValue';

import styles     from './ScreenHeading.less';

const cx = classnames.bind(styles);

function ScreenHeading(props) {
    const { isDisableTooltip, closeScreen, title, themeMode, withBackControl, isFullScreenWidget, t } = props;

    const screenHeadingCN = cx(styles.ScreenHeading, {
        withoutBackControl    : !withBackControl,
        fullScreenWidget      : !!isFullScreenWidget,
        [`${themeMode}Theme`] : themeMode
    });

    return (
        <div className={screenHeadingCN}>
            { withBackControl
                ? (
                    <Tooltip
                        title      = {isFullScreenWidget ? t('Back') : t('Close')}
                        enterDelay = {0}
                        classes    = {{ tooltip: styles.tooltip }}
                        isDisabled = {isDisableTooltip}
                    >
                        <div>
                            <IconButton
                                iconType  = {isFullScreenWidget ? 'arrowRightThin' : 'close'}
                                className = {styles.control}
                                onClick   = {closeScreen}
                            />
                        </div>
                    </Tooltip>
                ) : null
            }
            <CriticalValue
                className  = {styles.title}
                value      = {title}
                maxWidth   = {'150px'}
                isDisabled = {isDisableTooltip}
            />
        </div>
    );
}

ScreenHeading.propTypes = {
    isDisableTooltip   : PropTypes.bool,
    closeScreen        : PropTypes.func.isRequired,
    t                  : PropTypes.func.isRequired,
    title              : PropTypes.string,
    withBackControl    : PropTypes.bool,
    themeMode          : PropTypes.string,
    isFullScreenWidget : PropTypes.bool
};

ScreenHeading.defaultProps = {
    isDisableTooltip   : false,
    title              : '',
    withBackControl    : true,
    themeMode          : '',
    isFullScreenWidget : false
};

export default ScreenHeading;

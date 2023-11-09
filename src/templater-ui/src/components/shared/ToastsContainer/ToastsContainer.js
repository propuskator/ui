import React                    from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';
import { TransitionGroup }      from 'react-transition-group';
import { Detector }             from 'react-detect-offline';

import { TOASTS_KEYS }          from './../../../constants/toasts';
import ToastsAnimation          from './ToastsAnimation';
import Toast                    from './Toast';
import styles                   from './ToastsContainer.less';

const cx = classNames.bind(styles);

const DETECTOR_POLLING_CONFIG = {
    enabled : false
};

function ToastsContainer(props) {
    const { toasts, removeToast, removeToastByKey, addToast, networkStatusUpdate, t } = props;

    function onHandleOffline({ online }) {
        if (!online) {
            addToast({
                key                  : TOASTS_KEYS.networkError,
                title                : t('Something went wrong'),
                message              : t('Seems that connection with your network is lost. Please, try to establish connection.'),
                type                 : 'error',
                hideByTimeout        : false,
                withCloseAbility     : false,
                showOnSessionDestroy : true
            });
        } else removeToastByKey(TOASTS_KEYS.networkError);

        networkStatusUpdate({ isInternetReachable: online });

        return null;
    }

    function handleCloseToast(id) {
        removeToast(id);
    }

    const toastContainerCN = cx(styles.ToastsContainer, {
        empty : !toasts || (toasts && !toasts.length)
    });

    return (
        <div className={toastContainerCN}>
            <Detector
                render   = {onHandleOffline}
                polling  = {DETECTOR_POLLING_CONFIG}
            />
            <div className={styles.toastsWrapper}>
                <TransitionGroup>
                    {toasts.map(({
                        id, title, message, type, onAccept, timeout,
                        hideByTimeout, withCloseAbility, controls
                    } = {}) => (
                        <ToastsAnimation key={id}>
                            <div className={styles.toastWrapper}>
                                <Toast
                                    id               = {id}
                                    onClose          = {handleCloseToast}
                                    onAccept         = {onAccept}
                                    type             = {type}
                                    title            = {title}
                                    timeout          = {timeout}
                                    hideByTimeout    = {hideByTimeout}
                                    withCloseAbility = {withCloseAbility}
                                    controls         = {controls}
                                    message          = {message}
                                />
                            </div>
                        </ToastsAnimation>
                    ))}
                </TransitionGroup>
            </div>
        </div>
    );
}

ToastsContainer.propTypes = {
    toasts              : PropTypes.array.isRequired,
    removeToast         : PropTypes.func.isRequired,
    removeToastByKey    : PropTypes.func.isRequired,
    addToast            : PropTypes.func.isRequired,
    networkStatusUpdate : PropTypes.func.isRequired,
    t                   : PropTypes.func
};

ToastsContainer.defaultProps = {
    t : (text) => text
};

export default ToastsContainer;

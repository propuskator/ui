import React, {
    useState,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { useMedia }             from 'templater-ui/src/utils/mediaQuery';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import SecondLevelModal         from 'Modals/SecondLevelModal';

import styles                   from './Notifications.less';

const cx = classnames.bind(styles);


function Notifications(props) {
    const { counter } = props;
    const componentRef                    = useRef({});
    const [ modalData, setModalData ]     = useState();

    function handleOpenNotificationsModal(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        setModalData({
            name   : 'notifications',
            width  : 360,
            height : 252,
            styles : {}
        });
    }

    function handleCloseNotificationsModal() {
        setModalData();
    }

    const notificationsCN = cx(styles.Notifications, {
        withCounter : counter > 0
    });

    const isMobile = useMedia(
        // Media queries
        [ '(max-width: 612px)', '(min-width: 613px)' ],
        // values by media index
        [ true, false ],
        // Default
        false
    );

    function calcModalPosition() {
        if (isMobile) {
            return ({
                position : 'fixed',
                top      : '49px',
                right    : '0'
            });
        }

        return ({
            position : 'fixed',
            top      : '49px',
            right    : '239px'
        });
    }

    return (
        <div
            id        = 'notifications-wrapper'
            className = {notificationsCN}
            ref       = {node => componentRef.current.node = node}
        >
            <div className={styles.bellWrapper}>
                <div className={styles.notificationsIndicator}>
                    <span className={styles.notificationsCount}>
                        {counter}
                    </span>
                </div>
                <IconButton
                    iconType  = 'bell'
                    className = {styles.bellButton}
                    onClick   = {handleOpenNotificationsModal}
                />
            </div>
            <SecondLevelModal
                modalData         = {modalData}
                closeModal        = {handleCloseNotificationsModal}
                calcModalPosition = {calcModalPosition}
                withBoxshadow     = {false}
                closeOnOverlayClick
            />
        </div>
    );
}

Notifications.propTypes = {
    counter : PropTypes.number
};

Notifications.defaultProps = {
    counter : 0
};

export default React.memo(Notifications);

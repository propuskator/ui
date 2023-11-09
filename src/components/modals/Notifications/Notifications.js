import React, {
    useState,
    useEffect,
    useCallback
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';
import InfiniteScroll           from 'react-infinite-scroller';

import * as localStorageUtils   from 'templater-ui/src/utils/helpers/localStorage';
import Loader                   from 'templater-ui/src/components/base/Loader';
import IconButton               from 'templater-ui/src/components/base/IconButton';
import Link                     from 'templater-ui/src/components/base/Link';

import {
    NOTIFICATIONS_READ_FILTER
}                               from 'Constants/localStorage';
import SvgIcon                  from 'Base/SvgIcon';

import Notification             from './Notification';
import styles                   from './Notifications.less';

const cx = classnames.bind(styles);

function Notifications(props) {  // eslint-disable-line max-lines-per-function
    const {
        forwardRef, amount, list, lazyParams, onClose,
        updateNotificationsIsRead, readAllNotifications, fetchNotificationsLazy, onChangeCounter, t
    } = props;

    const [ isFilterByUnread, setIsFilterByUnread ]                     = useState(() => {
        return !!localStorageUtils.getData(NOTIFICATIONS_READ_FILTER);
    });
    const [ toReadNotifications, setToReadNotifications ]               = useState(() => {
        return list?.filter(item => !item.isRead)?.map(item => item.id);
    });
    const [ alreadyReadedNotifications, setAlreadyReadedNotifications ] = useState(() => {
        return list?.filter(item => item.isRead)?.map(item => item.id);
    });

    useEffect(() => () => {
        if (onClose) onClose({ selectedLength: toReadNotifications.length });
    }, [ toReadNotifications ]);

    useEffect(() => {
        localStorageUtils.saveData(NOTIFICATIONS_READ_FILTER, isFilterByUnread);
    }, [ isFilterByUnread ]);

    useEffect(() => {
        if (!list?.length) return;

        const notReaded    = list?.filter(item => !item.isRead) || [];
        const notReadedIds = notReaded.map(item => item.id);

        const newItems = notReadedIds
            .filter(itemId => !toReadNotifications.includes(itemId))
            .filter(itemId => !alreadyReadedNotifications.includes(itemId));

        const newToreadItems = newItems.filter(item => !item.isRead);
        const newReadedItems = newItems.filter(item => item.isRead);

        if (newToreadItems?.length) {
            setToReadNotifications(prevList => [ ...prevList, ...newToreadItems ]);
        }

        if (newReadedItems?.length) {
            setAlreadyReadedNotifications(prevList => [ ...prevList, ...newReadedItems ]);
        }
    }, [ list, toReadNotifications, alreadyReadedNotifications ]);


    useEffect(() => {
        if (onChangeCounter) onChangeCounter(toReadNotifications?.length);
    }, [ toReadNotifications?.length ]);

    function setRef(ref) {
        if (!forwardRef) return;

        forwardRef.current = ref;
    }

    function handleCloseModal() {
        props.closeModal();
    }

    function handleChangeSelectedNotifications({ name, value }) {
        if (!name) return;

        const toRead = value
            ? [ ...toReadNotifications, name ]
            : toReadNotifications.filter(item => item !== name);
        const alreadyRead = value
            ? alreadyReadedNotifications.filter(item => item !== name)
            : [ ...alreadyReadedNotifications, name ];

        setToReadNotifications(() => toRead);
        setAlreadyReadedNotifications(() => alreadyRead);

        updateNotificationsIsRead({ list: [ name ], isRead: !value });
    }

    function handleCheckAllAsRead(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();
        if (!list?.length) return;

        const idsList = list.map(item => item.id);

        setToReadNotifications(() => []);
        setAlreadyReadedNotifications(() => idsList);

        readAllNotifications();
    }

    function handleFilterList(e) {
        if (e) e.stopPropagation();
        if (e) e.preventDefault();

        setIsFilterByUnread(value => !value);
    }

    function handleLoadMore() {
        if (!lazyParams.isLazyLoading) {
            fetchNotificationsLazy();
        }
    }

    function hasMoreNotifications() {
        if (lazyParams.isLazyLoading) return false;

        return isFilterByUnread
            ? toReadNotifications.length < lazyParams.unreadTotal
            : amount < lazyParams.total;
    }

    function renderNotification(item) {
        return (
            <Notification
                key              = {item?.id}
                id               = {item?.id}
                notification     = {item}
                className        = {styles.notification}
                onToggleSelected = {handleChangeSelectedNotifications}
                isSelected       = {toReadNotifications.includes(item?.id)}
                closeModal       = {handleCloseModal}
                t                = {t}
            />
        );
    }

    function renderNotifications(list) {    // eslint-disable-line no-shadow
        return (
            <InfiniteScroll
                pageStart   = {0}
                loadMore    = {handleLoadMore}
                hasMore     = {hasMoreNotifications()}
                useWindow   = {false}
                loader      = {null}
                initialLoad = {false}
            >
                {list.map(renderNotification)}
            </InfiniteScroll>
        );
    }

    function getListToRender() {
        const fullList = list.map(listItem => {
            if (toReadNotifications.includes(listItem.id)) {
                return ({
                    ...listItem,
                    isRead : false
                });
            } else if (alreadyReadedNotifications.includes(listItem.id)) {
                return ({
                    ...listItem,
                    isRead : true
                });
            }

            return listItem;
        });

        return isFilterByUnread
            ? fullList.filter(item => !item?.isRead)
            : list;
    }

    const listToRender = getListToRender();

    const isLoading = lazyParams.isLazyLoading && !list?.length;

    const notificationsCN = cx(styles.Notifications, {
        withNotifications : amount > 0,
        loading           : isLoading && !listToRender.length
    });

    const isNotReadExist = !!toReadNotifications?.length;

    return (
        <div
            className = {notificationsCN}
            onClick   = {useCallback((e) => e.stopPropagation(), [])}
            ref       = {setRef}
        >
            <div className={styles.heading}>
                <div className={styles.title}>
                    {t('notifications:Notifications')}
                </div>

                <IconButton
                    className  = {styles.closeButton}
                    iconType   = 'cross'
                    onClick    = {handleCloseModal}
                />

                <div className={styles.controlsWrapper}>
                    <Link
                        className = {styles.control}
                        isHidden  = {!isNotReadExist}
                        onClick   = {handleCheckAllAsRead}
                        color     = 'primary'
                    >
                        {t('notifications:Mark all as read')}
                    </Link>

                    <Link
                        className = {styles.control}
                        isHidden  = {!list?.length}
                        onClick   = {handleFilterList}
                        color     = 'primary'
                    >
                        { !isFilterByUnread
                            ? t('notifications:Filter by unread')
                            : t('notifications:Show all')
                        }
                    </Link>
                </div>
            </div>
            <div className={styles.notificationsWrapper}>
                { renderNotifications(listToRender) }
                {!isLoading && !listToRender.length
                    ? (
                        <div className={styles.emptyListWrapper}>
                            <div className = {styles.iconWrapper}>
                                <SvgIcon
                                    type={isFilterByUnread ? 'nothingFound' : 'emptyList'}
                                />
                            </div>
                            <div className={styles.text}>
                                {isFilterByUnread
                                    ? t('Nothing found')
                                    : t('notifications:Notifications list is empty')
                                }
                            </div>
                        </div>
                    )
                    : null
                }
            </div>
            {!isFilterByUnread && isLoading
                ? (
                    <div className={styles.loaderWrapper}>
                        <Loader size='S' />
                    </div>
                )
                : null
            }
        </div>
    );
}

Notifications.propTypes = {
    fetchNotificationsLazy    : PropTypes.func.isRequired,
    updateNotificationsIsRead : PropTypes.func.isRequired,
    readAllNotifications      : PropTypes.func.isRequired,
    closeModal                : PropTypes.func.isRequired,
    onChangeCounter           : PropTypes.func,
    onClose                   : PropTypes.func,
    lazyParams                : PropTypes.shape({
        total         : PropTypes.number,
        unreadTotal   : PropTypes.number,
        isLazyLoading : PropTypes.bool
    }).isRequired,
    forwardRef : PropTypes.shape({
        current : PropTypes.shape({})
    }),
    list : PropTypes.arrayOf(PropTypes.shape({
        id        : PropTypes.string.isRequired,
        message   : PropTypes.string.isRequired,
        createdAt : PropTypes.string.isRequired,
        isRead    : PropTypes.bool.isRequired
    })),
    amount : PropTypes.number,
    t      : PropTypes.func.isRequired
};

Notifications.defaultProps = {
    forwardRef      : void 0,
    onClose         : void 0,
    onChangeCounter : void 0,
    list            : [],
    amount          : 0
};

export default React.memo(Notifications);

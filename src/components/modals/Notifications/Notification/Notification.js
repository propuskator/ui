/* eslint-disable  react/no-danger */
import React, {
    useRef,
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Button                   from 'templater-ui/src/components/base/Button';
import Tooltip                  from 'templater-ui/src/components/base/Tooltip';
import Avatar                   from 'templater-ui/src/components/base/Avatar';

import {
    getRelativeTime
}                               from 'Utils/date';
import history                  from 'History';
import * as ROUTES              from 'Constants/routes';
import Checkbox                 from 'Base/Checkbox';
import SvgIcon                  from 'Base/SvgIcon';

import styles                   from './Notification.less';

const cx = classnames.bind(styles);


function Notification(props) {  // eslint-disable-line max-lines-per-function
    const {
        id,
        isEditMode,
        isSelected,
        onToggleSelected,
        className,
        notification,
        closeModal,
        openModal,
        fetchAccessTokenReaders,
        fetchAccessSubjectTokens,
        fetchAccessSubjects,
        t
    } = props;
    const { type, createdAt, accessSubject } = notification;

    const componentRef = useRef({});
    const notificationCN = cx(styles.Notification, {
        red         : [ 'UNAUTH_ACCESS', 'UNAUTH_SUBJECT_ACCESS', 'UNAUTH_SUBJECT_PHN_ACCESS', 'UNAUTH_BUTTON_ACCESS', 'SECURITY_SYSTEM_ACCESS_ON' ].includes(notification?.type),
        editMode    : isEditMode,
        selected    : isSelected,
        [className] : className
    });

    function scrollToElement() {
        componentRef.current.scrollTimeout = setTimeout(() => {
            const elementToScroll = document.getElementById(`notification-${id}`);

            elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);    // eslint-disable-line no-magic-numbers
    }

    useEffect(() => {
        return () => {
            if (!componentRef?.current?.scrollTimeout) return;

            clearTimeout(componentRef.current.scrollTimeout);
        };
    }, [ ]);

    function handleCheckboxClick({ name, value } = {}) {
        onToggleSelected({ name, value });

        if (value) scrollToElement();
    }

    function renderTime() {
        return (
            <div className={cx(styles.time, styles.text)}>
                { getRelativeTime(createdAt) || '-' }
            </div>
        );
    }

    function getNotificationMessage() { // eslint-disable-line max-lines-per-function
        const { accessSubjectToken = {}, accessTokenReader = {}, data = {} } = notification;
        const readerName = accessTokenReader?.name;
        const tokenCode = data?.tokenCode;
        const tokenReaderCode = data?.tokenReaderCode;

        switch (type) {
            case 'UNAUTH_ACCESS':
                return accessSubject
                    ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html : t('notifications:UNAUTH_ACCESS_SUBJECT', {
                                    readerName,
                                    subjectName : accessSubject?.name
                                })
                            }}
                            className = {styles.messageWrapper}
                        />
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{
                                __html : t('notifications:UNAUTH_ACCESS_TOKEN', {
                                    readerName,
                                    tokenName : accessSubjectToken?.name
                                })
                            }}
                            className = {styles.messageWrapper}
                        />
                    );
            case 'ACTIVE_READER':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t('notifications:ACTIVE_READER', { readerName })
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'UNAUTH_SUBJECT_ACCESS':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t('notifications:UNAUTH_SUBJECT_ACCESS', { readerName, subjectName: accessSubject?.name })
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'INACTIVE_READER':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t('notifications:INACTIVE_READER', { readerName })
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'NEW_READER':
                return (
                    <div className={styles.messageWrapper}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html : t('notifications:NEW_READER', { tokenReaderCode })
                            }}
                        />
                        <div className={styles.footer}>
                            <div className={styles.timeWrapper}>
                                {renderTime()}
                            </div>
                            {!notification?.accessTokenReader?.id
                                ? (
                                    <Button
                                        size      = 'XS'
                                        className = {styles.control}
                                        onClick   = {() => {    // eslint-disable-line  react/jsx-no-bind
                                            if (isSelected) {
                                                onToggleSelected({ name: id, value: false });
                                            }
                                            closeModal();

                                            openModal('accessTokenReader', {
                                                isCreateEntity : true,
                                                initialData    : {
                                                    name : tokenReaderCode,
                                                    code : tokenReaderCode
                                                },
                                                onClose : ({ entity } = {}) => {
                                                    const availableRoutes = [
                                                        ROUTES.ACCESS_TOKEN_READERS,
                                                        ROUTES.ACCESS_SETTINGS
                                                    ];

                                                    if (entity
                                                        && availableRoutes.includes(history?.location?.pathname)) {
                                                        if (fetchAccessTokenReaders) fetchAccessTokenReaders();
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        {t('readers-page:Create access point')}
                                    </Button>
                                ) : null
                            }
                        </div>
                    </div>
                );
            case 'UNKNOWN_TOKEN':
                return (
                    <div className={styles.messageWrapper}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html : t('notifications:UNKNOWN_TOKEN', { readerName, tokenCode })
                            }}
                        />

                        <div className={styles.footer}>
                            <div className={styles.timeWrapper}>
                                {renderTime()}
                            </div>
                            {!notification?.accessSubjectToken?.id
                                ? (
                                    <Button
                                        size      = 'XS'
                                        className = {styles.control}
                                        onClick   = {() => {    // eslint-disable-line  react/jsx-no-bind
                                            if (isSelected) {
                                                onToggleSelected({ name: id, value: false });
                                            }
                                            closeModal();

                                            openModal('accessSubjectToken', {
                                                isCreateEntity : true,
                                                initialData    : {
                                                    name : tokenCode,
                                                    code : tokenCode
                                                },
                                                onClose : ({ entity } = {}) => {
                                                    const availableRoutes = [
                                                        ROUTES.ACCESS_SUBJECT_TOKENS
                                                    ];

                                                    if (entity
                                                        && availableRoutes.includes(history?.location?.pathname)) {
                                                        if (fetchAccessSubjectTokens) fetchAccessSubjectTokens();
                                                    }
                                                }
                                            });
                                        }}
                                    >
                                        {t('tokens-page:Create tag')}
                                    </Button>
                                ) : null
                            }
                        </div>
                    </div>
                );
            case 'DELETED_SUBJECT_PROFILE':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t('notifications:DELETED_SUBJECT_PROFILE', { subjectName: accessSubject?.name })
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'SUBJECT_DETACHED_TOKEN':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:SUBJECT_DETACHED_TOKEN',
                                { tokenName: accessSubjectToken?.name, subjectName: accessSubject?.name }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'SUBJECT_ATTACHED_TOKEN':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:SUBJECT_ATTACHED_TOKEN',
                                { tokenName: accessSubjectToken?.name, subjectName: accessSubject?.name }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'SUBJECT_ENABLED_TOKEN':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:SUBJECT_ENABLED_TOKEN',
                                { tokenName: accessSubjectToken?.name, subjectName: accessSubject?.name }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'SUBJECT_DISABLED_TOKEN':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:SUBJECT_DISABLED_TOKEN',
                                { tokenName: accessSubjectToken?.name, subjectName: accessSubject?.name }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );

            case 'ACCESS_SUBJECT_REGISTRATION':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:ACCESS_SUBJECT_REGISTRATION',
                                { subjectName: accessSubject?.name }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'UNAUTH_SUBJECT_PHN_ACCESS':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:UNAUTH_SUBJECT_PHN_ACCESS',
                                { subjectName: accessSubject?.name, readerName }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'UNAUTH_BUTTON_ACCESS':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:UNAUTH_BUTTON_ACCESS',
                                { readerName }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'SECURITY_SYSTEM_ACCESS_ON':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:SECURITY_SYSTEM_ACCESS_ON',
                                { readerName }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'SECURITY_SYSTEM_ACCESS_OFF':
                return (
                    <div
                        dangerouslySetInnerHTML={{
                            __html : t(
                                'notifications:SECURITY_SYSTEM_ACCESS_OFF',
                                { readerName }
                            )
                        }}
                        className = {styles.messageWrapper}
                    />
                );
            case 'USER_REQUEST_REGISTRATION':
                return (
                    <div className={styles.messageWrapper}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html : t('notifications:USER_REQUEST_REGISTRATION', { subjectName: data?.subjectName })
                            }}
                        />
                        <div className={styles.footer}>
                            <div className={styles.timeWrapper}>
                                {renderTime()}
                            </div>
                            {!notification?.accessSubject?.id
                                ? (
                                    <Button
                                        size      = 'XS'
                                        className = {styles.control}
                                        onClick   = {() => {    // eslint-disable-line  react/jsx-no-bind
                                            if (isSelected) {
                                                onToggleSelected({ name: id, value: false });
                                            }
                                            closeModal();
                                            openModal('accessSubject', {
                                                isCreateEntity         : true,
                                                isCreatingByRequest    : true,
                                                subjectDataFromRequest : data,
                                                onClose                : ({ entity } = {}) => {
                                                    const availableRoutes = [
                                                        ROUTES.ACCESS_SUBJECTS
                                                    ];

                                                    if (entity
                                                        && availableRoutes.includes(history?.location?.pathname)) {
                                                        if (fetchAccessSubjects) fetchAccessSubjects();
                                                    }
                                                }
                                            });
                                            }}
                                    >
                                        {t('subjects-page:Create subject')}
                                    </Button>
                                ) : null
                            }
                        </div>
                    </div>
                );
            default:
                return '';
        }
    }

    const SUCCESSES_BY_TYPE = {
        UNAUTH_ACCESS         : false,
        UNAUTH_SUBJECT_ACCESS : false,
        INACTIVE_READER       : false,
        UNKNOWN_TOKEN         : false,
        ACTIVE_READER         : true,
        NEW_READER            : true
    };

    const ICONS_BY_TYPE = {
        UNAUTH_ACCESS              : 'errorRed',
        INACTIVE_READER            : 'errorRed',
        UNAUTH_SUBJECT_ACCESS      : 'errorRed',
        UNKNOWN_TOKEN              : 'marks',
        ACTIVE_READER              : 'successGreen',
        NEW_READER                 : 'accessPoints',
        SECURITY_SYSTEM_ACCESS_ON  : 'securityAlarmNotify',
        SECURITY_SYSTEM_ACCESS_OFF : 'securityAlarmNotify',
        USER_REQUEST_REGISTRATION  : 'userRegistrationRequest'
    };

    const isSuccess = SUCCESSES_BY_TYPE[type] || false;
    const iconName  = ICONS_BY_TYPE[type] || 'errorRed';
    const isAvatar  = !isSuccess && accessSubject;
    const message   = getNotificationMessage();
    const showTime  = ![ 'UNKNOWN_TOKEN', 'NEW_READER', 'USER_REQUEST_REGISTRATION' ].includes(type);

    return (
        <div
            className = {notificationCN}
            ref       = {node => componentRef.current.node = node}
            id        = {`notification-${id}`}
        >
            <div className={styles.checkboxWrapper}>
                <Checkbox
                    onChange  = {handleCheckboxClick}
                    value     = {isSelected}
                    name      = {id}
                    tooltip   = {!isSelected
                        ? t('notifications:Mark as not read')
                        : t('notifications:Mark as read')
                    }
                />
            </div>
            <div className={styles.content}>
                <div className={styles.notificationIndicator}>
                    {isAvatar
                        ? (
                            <Tooltip title={accessSubject?.fullName}>
                                <div className={styles.avatarWrapper}>
                                    <Avatar
                                        avatarUrl   = {accessSubject?.avatar}
                                        avatarColor = {accessSubject?.avatarColor}
                                        fullName    = {accessSubject?.name}
                                        size        = {20}
                                    />
                                </div>
                            </Tooltip>
                        ) : (
                            <SvgIcon
                                className = {cx(styles.icon, { [iconName]: iconName })}
                                type      = {iconName}
                            />
                        )
                    }
                </div>
                <div className={styles.notificationBody}>
                    <div className={cx(styles.description, styles.text)}>
                        { message }
                    </div>

                    { showTime
                        ? renderTime()
                        : null
                    }
                </div>
            </div>
        </div>
    );
}

Notification.propTypes = {
    id           : PropTypes.string.isRequired,
    notification : PropTypes.shape({
        type : PropTypes.oneOf([
            'UNAUTH_ACCESS', 'NEW_READER', 'INACTIVE_READER', 'UNKNOWN_TOKEN',
            'ACTIVE_READER', 'UNAUTH_SUBJECT_ACCESS', 'SUBJECT_ATTACHED_TOKEN',
            'SUBJECT_DISABLED_TOKEN', 'SUBJECT_DETACHED_TOKEN', 'ACCESS_SUBJECT_REGISTRATION',
            'DELETED_SUBJECT_PROFILE', 'UNAUTH_SUBJECT_PHN_ACCESS', 'UNAUTH_BUTTON_ACCESS',
            'USER_REQUEST_REGISTRATION', 'SECURITY_SYSTEM_ACCESS_ON', 'SECURITY_SYSTEM_ACCESS_OFF'
        ]).isRequired,
        accessTokenReader : PropTypes.shape({
            name : PropTypes.string
        }),
        createdAt     : PropTypes.string,
        accessSubject : PropTypes.shape({
            fullName : PropTypes.string,
            avatar   : PropTypes.string
        })
    }).isRequired,
    isEditMode               : PropTypes.bool,
    isSelected               : PropTypes.bool,
    onToggleSelected         : PropTypes.func,
    className                : PropTypes.string,
    closeModal               : PropTypes.func.isRequired,
    openModal                : PropTypes.func.isRequired,
    fetchAccessTokenReaders  : PropTypes.func.isRequired,
    fetchAccessSubjectTokens : PropTypes.func.isRequired,
    fetchAccessSubjects      : PropTypes.func.isRequired,
    t                        : PropTypes.func.isRequired
};

Notification.defaultProps = {
    isEditMode       : false,
    isSelected       : false,
    onToggleSelected : void 0,
    className        : ''
};

export default React.memo(Notification);

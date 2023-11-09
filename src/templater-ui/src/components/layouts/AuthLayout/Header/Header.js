import React, {
    useState,
    useCallback,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import globalEscHandler         from './../../../../utils/eventHandlers/globalEscHandler';
import * as ROUTES              from './../../../../constants/routes';
import IconButton               from './../../../base/IconButton';
import Avatar                   from './../../../base/Avatar';
import SvgIcon                  from './../../../base/SvgIcon';
import Option                   from './Option';

import styles                   from './Header.less';

const cx = classnames.bind(styles);

const SETTINGS_ICON = () => <SvgIcon type='settings' className={styles.optionIcon} />;  // eslint-disable-line func-style
const EXIT_ICON = () => <SvgIcon type='exit' className={styles.optionIcon} />;  // eslint-disable-line func-style

function Header(props) {    /* eslint-disable-line max-lines-per-function */
    const { onToggleSidebar, userLogin, userAvatarUrl, t, renderThemeSelect } = props;
    const [ showSelect, setShowSelect ] = useState(false);
    const container    = useRef({});

    useEffect(() => {
        function handleClickOutside(event) {
            if (container.current && !container.current.contains(event.target)) setShowSelect(false);
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        function handleCloseSelect() {
            setShowSelect(false);
        }

        if (showSelect) globalEscHandler.register(handleCloseSelect);

        return () => {
            if (showSelect) globalEscHandler.unregister(handleCloseSelect);
        };
    }, [ showSelect ]);


    function handleSelectClick(e) {
        e.preventDefault();
        e.stopPropagation();
        setShowSelect(!showSelect);
    }

    function handleExitClick(e) {
        e.preventDefault();
        props.logout({ logoutAllTabs: true });
    }

    function handleOpenSettings() {
        setShowSelect(false);
    }

    return (
        <div className = {styles.Header}>
            <div className={styles.leftBlock}>
                <IconButton
                    className = {styles.menu}
                    onClick   = {onToggleSidebar}
                    iconType  = 'menu'
                />
            </div>

            <div className={styles.rightBlock}>
                <div className = {styles.selectContainer} ref = {node => container.current = node}>
                    <a
                        href      = ''
                        className = {cx(styles.select, 'abort-submit')}
                        onClick   = {handleSelectClick}
                    >
                        <div className = {styles.user}>
                            <div className={styles.avatarWrapper}>
                                <Avatar
                                    avatarUrl      = {userAvatarUrl}
                                    size           = {20}
                                    renderFallback = {useCallback(() => (
                                        <SvgIcon
                                            type   = 'user'
                                        />
                                    ), [])}
                                />
                            </div>
                            <span
                                className = {`${styles.textContainer}
                                ${styles.loginLabel}`}
                            >
                                {userLogin}
                            </span>
                        </div>
                        <SvgIcon
                            type      = 'arrowDown'
                            className = {cx(styles.arrowClose, {
                                [styles.arrowOpen] : showSelect
                            })}
                        />
                    </a>
                    <div
                        className = {cx(styles.options, {
                            [styles.visible] : showSelect,
                            hidden           : !showSelect
                        })}>
                        { renderThemeSelect
                            ? (
                                <Option
                                    renderContent = {renderThemeSelect}
                                    disableFocus
                                />
                            ) : null
                        }
                        <Option
                            icon         = {SETTINGS_ICON}
                            onClick      = {showSelect ? handleOpenSettings : () => {}}
                            text         = {t('Account settings')}
                            disableFocus = {!showSelect}
                            href         = {ROUTES.ACCOUNT_SETTINGS}
                        />
                        <Option
                            icon         = {EXIT_ICON}
                            onClick      = {showSelect ? handleExitClick : () => {}}
                            text         = {t('Log out')}
                            disableFocus = {!showSelect}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

Header.propTypes = {
    userLogin         : PropTypes.string,
    logout            : PropTypes.func.isRequired,
    onToggleSidebar   : PropTypes.func.isRequired,
    userAvatarUrl     : PropTypes.string,
    t                 : PropTypes.func,
    renderThemeSelect : PropTypes.func
};

Header.defaultProps = {
    userLogin         : '',
    userAvatarUrl     : '',
    t                 : (text) => text,
    renderThemeSelect : void 0
};

export default Header;

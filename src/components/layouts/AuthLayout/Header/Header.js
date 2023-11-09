import React, {
    useState,
    useCallback,
    useEffect,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import ExitToAppIcon            from '@material-ui/icons/ExitToApp';
import SettingsIcon             from '@material-ui/icons/Settings';
import classnames               from 'classnames/bind';

import IconButton               from 'templater-ui/src/components/base/IconButton';
import Avatar                   from 'templater-ui/src/components/base/Avatar';

import history                  from 'History';
import * as ROUTES              from 'Constants/routes';
import * as STATUS_CODES        from 'Constants/keyCodes';
import ThemeSelect              from 'Shared/ThemeSelect';
import SvgIcon                  from 'Base/SvgIcon';
import Option                   from './Option';
import Notifications            from './Notifications';

import styles                   from './Header.less';

const cx = classnames.bind(styles);

function Header(props) {    /* eslint-disable-line max-lines-per-function */
    const { onToggleSidebar, userLogin, userAvatarUrl, t } = props;
    const [ showSelect, setShowSelect ] = useState(false);
    const container    = useRef({});

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', pressKey);

        function handleClickOutside(event) {
            if (container.current && !container.current.contains(event.target)) setShowSelect(false);
        }

        function pressKey(event) {
            if (event.keyCode === STATUS_CODES.ESCAPE) setShowSelect(false);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', pressKey);
        };
    }, []);


    function handleSelectClick(e) {
        e.preventDefault();
        e.stopPropagation();
        setShowSelect(!showSelect);
    }

    function handleExitClick(e) {
        e.preventDefault();
        props.logout({ logoutAllTabs: true });
    }

    function handleOpenSettings(e) {
        e.preventDefault();

        history.push(ROUTES.ACCOUNT_SETTINGS);
        setShowSelect(false);
    }

    function renderThemeSelect() {
        return (
            <ThemeSelect className={styles.themeSelect} withTitle={false} />
        );
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

                <Notifications />

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
                            type = 'arrowDown'
                            className = {cx(styles.arrowClose, { [styles.arrowOpen]: showSelect })}
                        />
                    </a>
                    <div
                        className = {cx(styles.options, {
                            [styles.visible] : showSelect
                        })}>
                        <Option
                            renderContent = {renderThemeSelect}
                            disableFocus
                        />
                        <Option
                            icon         = {SettingsIcon}
                            onClick      = {handleOpenSettings}
                            text         = {t('Account settings')}
                            disableFocus = {!showSelect}
                        />
                        <Option
                            icon         = {ExitToAppIcon}
                            onClick      = {handleExitClick}
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
    userLogin       : PropTypes.string,
    logout          : PropTypes.func.isRequired,
    onToggleSidebar : PropTypes.func.isRequired,
    userAvatarUrl   : PropTypes.string,
    t               : PropTypes.func.isRequired
};

Header.defaultProps = {
    userLogin     : '',
    userAvatarUrl : ''
};

export default Header;

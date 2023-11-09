import React, {
    useState
}                      from 'react';
import PropTypes       from 'prop-types';

import { useMedia }    from './../../../utils/mediaQuery';
import NAVIGATION_TABS from './../../../constants/navigation';

import Header          from './Header';
import Sidebar         from './Sidebar';
import styles          from './AuthLayout.less';


function AuthLayout(props) {
    const {
        children,
        tabs,
        bottomTabs,
        logout,
        userLogin,
        userAvatarUrl,
        modalsComponent,
        t,
        renderThemeSelect
    } = props;
    const isMobile = useMedia(
        // Media queries
        [ 'only screen and (hover: none) and (max-width: 900px) and (orientation: landscape)', '(max-width: 767px)' ],
        // values by media index
        [ true, true, false ],
        // Default
        false
    );

    const [ isSideBarOpen, setIsSidebarOpen ] = useState(!isMobile);

    function handleToggleSidebar() {
        setIsSidebarOpen(prev => !prev);
    }

    function handleCloseSidebar() {
        setIsSidebarOpen(false);
    }

    return (
        <div className={styles.AuthLayout}>
            <Sidebar
                tabs       = {tabs || NAVIGATION_TABS}
                isOpen     = {isSideBarOpen}
                onToggle   = {handleToggleSidebar}
                onClose    = {handleCloseSidebar}
                bottomTabs = {bottomTabs}
                t          = {t}
            />

            <div className={styles.content}>
                <Header
                    onToggleSidebar   = {handleToggleSidebar}
                    logout            = {logout}
                    userLogin         = {userLogin}
                    userAvatarUrl     = {userAvatarUrl}
                    t                 = {t}
                    renderThemeSelect = {renderThemeSelect}
                />
                <div className={styles.children}>
                    {children}
                </div>
            </div>
            {modalsComponent || null}
        </div>
    );
}

AuthLayout.propTypes = {
    children          : PropTypes.element.isRequired,
    tabs              : PropTypes.array,
    bottomTabs        : PropTypes.array,
    userLogin         : PropTypes.string,
    logout            : PropTypes.func.isRequired,
    userAvatarUrl     : PropTypes.string,
    modalsComponent   : PropTypes.element,
    t                 : PropTypes.func,
    renderThemeSelect : PropTypes.func
};

AuthLayout.defaultProps = {
    tabs              : [],
    bottomTabs        : [],
    userLogin         : '',
    userAvatarUrl     : '',
    modalsComponent   : void 0,
    t                 : (text) => text,
    renderThemeSelect : void 0
};

export default AuthLayout;

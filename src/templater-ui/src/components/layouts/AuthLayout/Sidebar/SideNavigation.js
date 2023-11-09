/* eslint-disable react/jsx-no-bind */
import React            from 'react';
import PropTypes        from 'prop-types';
import { useHistory }   from 'react-router-dom';

import List             from '@material-ui/core/List';
import NavItem          from './NavItem';


import { useMedia }     from './../../../../utils/mediaQuery';
import * as ROUTES      from './../../../../constants/routes';

import styles           from './SideBar.less';


function SideNavigation(props) {
    const { closeMenu, pathname, tabs = [], bottomTabs, isOpen, t } = props;

    const isInitRoute = pathname === '/';
    const activePathname = isInitRoute
        ? ROUTES.ACCESS_SETTINGS
        : pathname;
    const history = useHistory();

    const isMobile = useMedia(
        // Media queries
        [ 'only screen and (hover: none) and (max-width: 900px) and (orientation: landscape)', '(max-width: 767px)' ],
        // values by media index
        [ true, true, false ],
        // Default
        false
    );

    function handleTabClick({ path, onClick }) {
        return () => {
            if (onClick) {
                onClick();
            } else {
                const { state = {} } = history?.location || {};
                const currentRouteParams = state && activePathname?.includes(path) && !isInitRoute
                    ? state
                    : void 0;

                history.replace(path, currentRouteParams);
            }

            if (isMobile && closeMenu) closeMenu();
        };
    }

    function renderMenuItem(itemData) {
        const { path, title, icon = '', variant = '', onClick } = itemData;

        return (
            <NavItem
                title       = {title}
                iconType    = {icon}
                variant     = {variant}
                onClick     = {handleTabClick({ path, onClick })}
                showTooltip = {!(isMobile || isOpen)}
                isActive    = {path === activePathname}
                isOpened    = {isOpen}
                t           = {t}
                key         = {path}
            />
        );
    }

    function renderBottomList() {
        if (!bottomTabs.length) return null;

        return (
            <List className={styles.bottomList}>
                {bottomTabs.map(renderMenuItem)}
            </List>
        );
    }

    return (
        <div className={styles.sidebarWrapper}>
            <List className={styles.sidebarList}>
                { tabs.map(renderMenuItem) }
            </List>
            {
                renderBottomList()
            }
        </div>
    );
}

SideNavigation.propTypes = {
    tabs : PropTypes.arrayOf(PropTypes.shape({
        path  : PropTypes.string.isRequired,
        title : PropTypes.string.isRequired,
        icon  : PropTypes.string.isRequired
    })).isRequired,
    bottomTabs : PropTypes.arrayOf(PropTypes.shape({
        path    : PropTypes.string,
        title   : PropTypes.string.isRequired,
        icon    : PropTypes.string.isRequired,
        onClick : PropTypes.func
    })).isRequired,
    pathname  : PropTypes.string.isRequired,
    closeMenu : PropTypes.func.isRequired,
    isOpen    : PropTypes.bool.isRequired,
    t         : PropTypes.func.isRequired
};

export default SideNavigation;

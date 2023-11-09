/* eslint-disable react/jsx-no-bind */

import React          from 'react';
import PropTypes      from 'prop-types';
import classnames     from 'classnames/bind';
import { Link }       from 'react-router-dom';
import List           from '@material-ui/core/List';
import ListItem       from '@material-ui/core/ListItem';

import { useMedia }   from 'templater-ui/src/utils/mediaQuery';
import Tooltip        from 'templater-ui/src/components/base/Tooltip';
import Chip           from 'templater-ui/src/components/base/Chip';

import * as ROUTES    from 'Constants/routes';
import SvgIcon        from 'Base/SvgIcon';

import styles from './SideBar.less';

const cx = classnames.bind(styles);

function SideNavigation(props) {
    const { closeMenu, pathname, tabs = [], isOpen, t } = props;

    const isMobile = useMedia(
        // Media queries
        [ 'only screen and (hover: none) and (max-width: 900px) and (orientation: landscape)', '(max-width: 767px)', '(min-width: 768ppx)' ],
        // values by media index
        [ true, true, false ],
        // Default
        false
    );

    const showTooltip = !isMobile && !isOpen;

    function handleTabClick() {
        if (isMobile && closeMenu) closeMenu();
    }

    function renderMenuItem(itemData) {
        const { path, title, icon = '', chip } = itemData;
        const activePathname = pathname === '/'
            ? ROUTES.ACCESS_SETTINGS
            : pathname;

        const menuItemCN = cx(styles.sidebarLink, 'abort-submit', {
            active : path === activePathname
        });

        return (
            <Link
                onClick   = {handleTabClick}
                className = {menuItemCN}
                to        = {path}
                key       = {path}
            >
                { showTooltip
                    ? (
                        <Tooltip title={t(title)} placement='bottom' >
                            <div className={styles.tabIconWrapper}>
                                <SvgIcon className={styles.tabIcon} type={icon} color='white' />
                            </div>
                        </Tooltip>
                    ) : (
                        <div className={styles.tabIconWrapper}>
                            <SvgIcon className={styles.tabIcon} type={icon} color='white' />
                        </div>
                    )
                }
                <ListItem className={styles.sidebarItem}>
                    {t(title)}
                    {
                        chip
                            ? <Chip
                                {...chip}
                                className = {styles.chip}
                                size      = 'S'
                            >{chip?.text}</Chip>
                            : null
                    }
                </ListItem>
            </Link>
        );
    }

    return (
        <List className={styles.sidebarList}>
            { tabs.map(renderMenuItem) }
        </List>
    );
}

SideNavigation.propTypes = {
    tabs : PropTypes.arrayOf(PropTypes.shape({
        path  : PropTypes.string.isRequired,
        title : PropTypes.string.isRequired,
        icon  : PropTypes.string.isRequired
    })).isRequired,
    pathname  : PropTypes.string.isRequired,
    closeMenu : PropTypes.func.isRequired,
    isOpen    : PropTypes.bool.isRequired,
    t         : PropTypes.func.isRequired
};

export default SideNavigation;

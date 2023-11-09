import React        from 'react';
import PropTypes    from 'prop-types';

import classnames   from 'classnames/bind';

import ListItem     from '@material-ui/core/ListItem';

import Tooltip      from '../../../../base/Tooltip/Tooltip';
import SvgIcon      from '../../../../base/SvgIcon';

import styles       from './NavItem.less';

import '../SideBar.less';

const cx = classnames.bind(styles);


function NavItem(props) {
    const { title, iconType, isActive, isOpened, showTooltip, onClick, variant, t } = props;

    const navItemCN = cx(styles.NavItem, 'abort-submit', [ variant ], {
        active : isActive,
        closed : !isOpened
    });

    return (
        <div
            onClick   = {onClick}
            className = {navItemCN}
        >
            { showTooltip
                ? (
                    <Tooltip title={t(title)} placement='bottom' >
                        <div className={styles.tabIconWrapper}>
                            <SvgIcon className={styles.tabIcon} type={iconType} color='white' />
                        </div>
                    </Tooltip>
                ) : (
                    <div className={styles.tabIconWrapper}>
                        <SvgIcon
                            className={styles.tabIcon} type={iconType} color='white' />
                    </div>
                )
            }
            <ListItem className={styles.sidebarItem}>
                {t(title)}
            </ListItem>
        </div>
    );
}

NavItem.propTypes = {
    title       : PropTypes.string.isRequired,
    iconType    : PropTypes.string.isRequired,
    isActive    : PropTypes.bool,
    isOpened    : PropTypes.bool,
    showTooltip : PropTypes.bool,
    onClick     : PropTypes.func.isRequired,
    variant     : PropTypes.oneOf([ '', 'trigger' ]),
    t           : PropTypes.func
};

NavItem.defaultProps = {
    isActive    : false,
    isOpened    : false,
    showTooltip : false,
    variant     : '',
    t           : t => t
};


export default NavItem;

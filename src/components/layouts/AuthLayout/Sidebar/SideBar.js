import React            from 'react';
import PropTypes        from 'prop-types';
import { withRouter }   from 'react-router-dom';
import classnames       from 'classnames/bind';

import SvgIcon          from 'Base/SvgIcon';

import SideNavigation   from './SideNavigation';
import styles           from './SideBar.less';

const cx = classnames.bind(styles);

class Sidebar extends React.PureComponent {
    static propTypes = {
        tabs     : PropTypes.array.isRequired,
        location : PropTypes.shape({
            pathname : PropTypes.string.isRequired
        }).isRequired,
        isOpen   : PropTypes.bool.isRequired,
        onToggle : PropTypes.func.isRequired,
        onClose  : PropTypes.func.isRequired,
        t        : PropTypes.func.isRequired
    };

    render() {
        const { tabs, location : { pathname }, isOpen, onToggle, onClose, t } = this.props;
        const sideBarContainerCN = cx(styles.sideBarContainer, {
            open  : isOpen,
            close : !isOpen
        });

        return (
            <div className={sideBarContainerCN}>
                <div
                    className = {styles.overlay}
                    onClick   = {onToggle}
                />
                <div className={styles.contentWrapper}>
                    <SvgIcon
                        type      = 'close'
                        color     = 'white'
                        className = {styles.closeButton}
                        onClick   = {onClose}
                    />
                    <SideNavigation
                        tabs      = {tabs}
                        pathname  = {pathname}
                        closeMenu = {onClose}
                        isOpen    = {isOpen}
                        t         = {t}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Sidebar);

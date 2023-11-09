import React, {
    useState,
    useEffect
}                      from 'react';
import PropTypes       from 'prop-types';

import { useMedia }    from 'templater-ui/src/utils/mediaQuery';

import NAVIGATION_TABS from 'Constants/navigation';
import ModalContainer  from 'Modals/ModalContainer';

import Header          from './Header';
import Sidebar         from './Sidebar';
import styles          from './AuthLayout.less';


function AuthLayout(props) {
    const { checkSession, children, t } = props;

    const isMobile = useMedia(
        // Media queries
        [ 'only screen and (hover: none) and (max-width: 900px) and (orientation: landscape)', '(max-width: 767px)', '(min-width: 768ppx)' ],
        // values by media index
        [ true, true, false ],
        // Default
        false
    );

    const [ isSideBarOpen, setIsSidebarOpen ] = useState(!isMobile);

    useEffect(() => {
        checkSession();
    }, []);

    function handleToggleSidebar() {
        setIsSidebarOpen(prev => !prev);
    }

    function handleCloseSidebar() {
        setIsSidebarOpen(false);
    }

    return (
        <div className={styles.AuthLayout}>
            <Sidebar
                tabs     = {NAVIGATION_TABS}
                isOpen   = {isSideBarOpen}
                onToggle = {handleToggleSidebar}
                onClose  = {handleCloseSidebar}
                t        = {t}
            />

            <div className={styles.content}>
                <Header onToggleSidebar={handleToggleSidebar} t={t} />
                <div className={styles.children}>
                    {children}
                </div>
            </div>

            <ModalContainer />
        </div>
    );
}

AuthLayout.propTypes = {
    checkSession : PropTypes.func.isRequired,
    children     : PropTypes.element.isRequired,
    t            : PropTypes.func.isRequired
};

export default AuthLayout;

import React, {
    useContext,
    useEffect,
    useRef
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import TabsContext      from '../TabsContext';

import styles           from './Tab.less';

const cx = classnames.bind(styles);

function Tab(props) {
    const { className, children, value, label, forwardRef, themeMode } = props;

    const {
        onClick,
        activeTab,
        isFullWidth,
        isAutoScroll
    } = useContext(TabsContext);

    const tabContentRef = useRef();

    const isActiveTab = value === activeTab;

    useEffect(() => {
        if (isActiveTab && isAutoScroll && tabContentRef) {
            // eslint-disable-next-line babel/no-unused-expressions
            tabContentRef.current?.scrollIntoView({
                behavior : 'smooth',
                block    : 'nearest',
                inline   : 'center'
            });
        }
    }, [ isActiveTab, isAutoScroll, tabContentRef ]);

    function handleClick(e) {
        if (onClick && !isActiveTab) onClick(e, value);
    }

    const tabsCN = cx(styles.Tab, {
        [className]           : className,
        [`${themeMode}Theme`] : themeMode,
        active                : isActiveTab,
        fullWidth             : isFullWidth
    });

    return (
        <div
            className = {tabsCN}
            onClick   = {handleClick}
            ref       = {forwardRef}
        >
            <div
                className = {styles.tabContent}
                ref       = {tabContentRef}
            >
                {label || children}
            </div>

            <span className={styles.indicator} />
        </div>
    );
}

Tab.propTypes = {
    className  : PropTypes.string,
    value      : PropTypes.string.isRequired,
    label      : PropTypes.any,
    forwardRef : PropTypes.object,
    children   : PropTypes.any,
    themeMode  : PropTypes.oneOf([ 'light', 'dark' ])
};

Tab.defaultProps = {
    className  : '',
    label      : '',
    forwardRef : void 0,
    children   : void 0,
    themeMode  : 'light'
};

export default React.memo(Tab);

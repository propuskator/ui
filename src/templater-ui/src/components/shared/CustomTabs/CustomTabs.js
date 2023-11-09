import React, {
    useCallback,
    useMemo
}                           from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import TabsContext          from './TabsContext';

import styles               from './CustomTabs.less';

const cx = classnames.bind(styles);

function CustomTabs(props) {
    const {
        className, value, onChange,
        forwardRef, centered,
        isFullWidth, isAutoScroll, children
    } = props;

    const handleTabClick = useCallback((e, tabValue) => {
        if (onChange) onChange(e, tabValue);
    }, [ onChange ]);

    const contextValue = useMemo(() => ({
        isFullWidth,
        isAutoScroll,
        activeTab : value,
        onClick   : handleTabClick
    }), [ handleTabClick, value, isFullWidth, isAutoScroll ]);

    const customTabsCN = cx(styles.CustomTabs, [ className ], {
        centered
    });

    return (
        <div className={customTabsCN}>
            <div className={styles.tabsWrapper} ref={forwardRef}>
                <TabsContext.Provider value={contextValue}>
                    {children}
                </TabsContext.Provider>
            </div>
        </div>
    );
}

CustomTabs.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.any.isRequired,
    onChange     : PropTypes.func,
    centered     : PropTypes.bool,
    isFullWidth  : PropTypes.bool,
    isAutoScroll : PropTypes.bool,
    forwardRef   : PropTypes.object,
    children     : PropTypes.any
};

CustomTabs.defaultProps = {
    className    : '',
    centered     : false,
    isFullWidth  : false,
    isAutoScroll : true,
    onChange     : void 0,
    forwardRef   : void 0,
    children     : void 0
};

export default CustomTabs;

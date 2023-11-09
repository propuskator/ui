import React, {
    Fragment,
    // useEffect,
    useState
}                                  from 'react';
import PropTypes                   from 'prop-types';
import MaterialTabs                from '@material-ui/core/Tabs';
import Tab                         from '@material-ui/core/Tab';
import classnames                  from 'classnames/bind';

import SvgIcon                     from '../../base/SvgIcon';

import styles                      from './Tabs.less';

const cx = classnames.bind(styles);

function Tabs(props) {
    const {
        forwardRef, centered, renderTab,
        classes, tabs, withDivider, initialTabIndex,
        emptyMessage, onChangeTab
    } = props;
    const [ activeTab, setActiveTab ] = useState(initialTabIndex || 0);

    if ('current' in forwardRef) {
        forwardRef.current = {
            getActiveTab : () => activeTab,
            setActiveTab : (tab) => setActiveTab(tab)
        };
    }

    function handleChangeTab(e, selectedTab) {
        setActiveTab(selectedTab);
        if (onChangeTab) onChangeTab(selectedTab);
    }

    function renderTabContent() {
        const activeTabData = tabs[activeTab];

        return (
            <div className = {cx(styles.content, classes.content)}>
                { activeTabData
                    ? activeTabData?.content
                    : null
                }
            </div>
        );
    }

    const tabsCN = cx(styles.Tabs, classes.tabsContainer, {
        withDivider
    });

    return (
        <div width='100%' className={tabsCN}>
            { tabs.length
                ? (
                    <Fragment>
                        <div className={cx(styles.tabsWrapepr, classes.tabsWrapper, { centered: !!centered })}>
                            <MaterialTabs
                                className      = {cx(styles.tabs, classes.tabs)}
                                value          = {activeTab}
                                onChange       = {handleChangeTab}
                                indicatorColor = 'primary'
                                classes        = {{
                                    indicator : cx(
                                        styles.indicator, classes.indicator,
                                        { fullWidth: tabs.length === 1 }
                                    )
                                }}
                                centered = {centered}
                            >
                                { tabs.map((tabData) => {
                                    const { label, id, isDisabled = false } = tabData;

                                    return (
                                        <Tab
                                            key       = {id}
                                            label     = {renderTab ? renderTab(label) : label}
                                            className = {cx(styles.tab, classes.tab, tabData?.className)}
                                            disableFocusRipple
                                            disableRipple
                                            disabled  = {isDisabled}
                                        />
                                    );
                                })}
                            </MaterialTabs>
                        </div>

                        { renderTabContent() }
                    </Fragment>
                ) : (
                    <div className={styles.emptyMessageWrapper}>
                        <SvgIcon
                            type      = 'nothingFound'
                            className = {styles.icon}
                            color     = 'greyLight'
                        />

                        <div className={styles.message}>
                            {emptyMessage}
                        </div>
                    </div>
                )
            }
        </div>
    );
}

Tabs.propTypes = {
    tabs : PropTypes.arrayOf(PropTypes.shape({
        label   : PropTypes.string,
        id      : PropTypes.string,
        content : PropTypes.any
    })).isRequired,
    classes    : PropTypes.object,
    forwardRef : PropTypes.shape({
        current : PropTypes.shape({})
    }),
    withDivider     : PropTypes.bool,
    centered        : PropTypes.bool,
    emptyMessage    : PropTypes.any,
    renderTab       : PropTypes.func,
    onChangeTab     : PropTypes.func,
    initialTabIndex : PropTypes.number
};

Tabs.defaultProps = {
    withDivider     : true,
    centered        : false,
    forwardRef      : {},
    classes         : {},
    emptyMessage    : '',
    renderTab       : void 0,
    onChangeTab     : void 0,
    initialTabIndex : void 0
};

export default Tabs;

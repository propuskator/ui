import React, {
    useCallback, useMemo,
    useState
}                                       from 'react';
import {
    DragDropContext,
    Draggable,
    Droppable
}                                       from 'react-beautiful-dnd';
import PropTypes                        from 'prop-types';
import classnames                       from 'classnames/bind';

import SvgIcon                          from '../../../base/SvgIcon';
import CustomTabs                       from '../../../shared/CustomTabs';
import Tab                              from '../../../shared/CustomTabs/Tab/Tab';

import styles                           from '../../../shared/Tabs/Tabs.less';

const cx = classnames.bind(styles);

function WidgetsTabs(props) {
    const {
        tabs, renderTab, onChangeOrder, isDragDisabled, classes,
        forwardRef, themeMode, t
    } = props;

    const [ activeTab, setActiveTab ] = useState(tabs[0]?.id);

    if ('current' in forwardRef) {
        forwardRef.current = {
            getActiveTab : () => activeTab,
            setActiveTab : (tab) => setActiveTab(tab)
        };
    }

    const handleDragEnd = useCallback(({ draggableId, source, destination }) => {
        if (source && destination && source !== destination) {
            onChangeOrder(draggableId, source.index, destination.index);
        }
    }, [ onChangeOrder ]);

    function handleChangeTab(e, selectedTab) {
        setActiveTab(selectedTab);
    }

    function renderTabContent() {
        const activeTabData = tabs?.find(({ id }) => id === activeTab);

        return (
            <div className = {cx(styles.content, classes.content)}>
                { activeTabData
                    ? activeTabData?.content
                    : null
                }
            </div>
        );
    }

    const memoTabs = useMemo(() => tabs.map(({ label, id }, index) =>  (
        <Draggable
            draggableId    = {id}
            isDragDisabled = {isDragDisabled}
            index          = {index}
            key            = {id}
        >
            { provided => (
                <div
                    ref = {provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Tab
                        className = {cx(styles.tab, classes.tab)}
                        value     = {id}
                        label     = {renderTab(label)}
                        themeMode = {themeMode}
                    />
                </div>)
            }
        </Draggable>
    )), [ tabs, renderTab, isDragDisabled ]);

    const tabsCN = cx(styles.Tabs, classes.tabsContainer);

    return (
        <div className={tabsCN} >
            { tabs.length
                ? (
                    <>
                        <div className={cx(styles.tabsWrapepr, classes.tabsWrapper)}>
                            <DragDropContext onDragEnd = {handleDragEnd}>
                                <Droppable
                                    droppableId = 'droppableWidgetTabs'
                                    direction   = 'horizontal'
                                >
                                    {
                                        provided => (
                                            <CustomTabs
                                                className      = {cx(styles.tabs, classes.tabs)}
                                                value          = {activeTab}
                                                onChange       = {handleChangeTab}
                                                forwardRef     = {provided.innerRef}
                                                isFullWidth    = {tabs.length === 1}
                                                {...provided.droppableProps}
                                            >
                                                {memoTabs}
                                                {provided.placeholder}
                                            </CustomTabs>
                                        )
                                    }
                                </Droppable>
                            </DragDropContext>
                        </div>

                        { renderTabContent() }
                    </>
                ) : (
                    <div className={styles.emptyMessageWrapper}>
                        <SvgIcon
                            type      = 'nothingFound'
                            className = {styles.icon}
                            color     = 'greyLight'
                        />
                        <div className={styles.message}>
                            {t('There are no widgets yet')}
                        </div>
                    </div>
                )
            }
        </div>
    );
}

WidgetsTabs.propTypes = {
    className : PropTypes.string,
    tabs      : PropTypes.array,
    classes   : PropTypes.shape({
        tabsContainer : PropTypes.string,
        tabsWrapper   : PropTypes.string,
        tabs          : PropTypes.string,
        tab           : PropTypes.string,
        content       : PropTypes.string,
        indicator     : PropTypes.string
    }),
    isDragDisabled : PropTypes.bool,
    renderTab      : PropTypes.func,
    onChangeOrder  : PropTypes.func,
    forwardRef     : PropTypes.object,
    themeMode      : PropTypes.oneOf([ 'light', 'dark' ]),
    t              : PropTypes.func
};

WidgetsTabs.defaultProps = {
    className      : '',
    tabs           : [],
    classes        : {},
    isDragDisabled : false,
    renderTab      : void 0,
    onChangeOrder  : void 0,
    forwardRef     : void 0,
    themeMode      : 'light',
    t              : (text) => text
};

export default WidgetsTabs;

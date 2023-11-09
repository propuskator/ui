import React                     from 'react';
import classnames                from 'classnames/bind';
import PropTypes                 from 'prop-types';

import CriticalValue             from '../../../base/CriticalValue';
import Tooltip                   from '../../../base/Tooltip';
import IconButton                from '../../../base/IconButton';

import styles                    from './TabTitle.less';

const cx = classnames.bind(styles);

function TabTitle(props) {   // eslint-disable-line max-lines-per-function
    const {
        openModal, closeModal, isSingleTab,
        isEditMode, isProcessing, tabId,
        isBrokerConnected, tabs,
        onDeleteTab, onChangeTitle,
        className, t
    } = props;

    function handleDeleteTab(e) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        if (isSingleTab) return;

        openModal('confirm', {
            onSubmit : () => {
                if (onDeleteTab) onDeleteTab(tabId);

                closeModal('confirm');
            },
            onCancel : () => {
                closeModal('confirm');
            },
            title   : t('layout-page:Delete tab', { tabId }),
            message : t('layout-page:Are you sure you want to delete this tab?'),
            size    : 'L'
        });
    }

    function handleTabTitleClick() {
        if (isProcessing) return;
        const tabData = tabs?.find(tab => tab?.title === tabId);
        const tabNames = tabs?.map(tab => tab?.title);

        openModal('base', {
            title    : t('layout-page:Change tab title'),
            onSubmit : (data) => {
                if (data?.title === tabId) {
                    return closeModal('base');
                } else if (!data?.title) {
                    throw ({ title: t('validation:Field is required') }); // eslint-disable-line no-throw-literal
                } else {
                    if (tabNames?.includes(data?.title)) {
                        throw ({ title: t('validation:Value should be unique') }); // eslint-disable-line no-throw-literal
                    }

                    if (onChangeTitle) onChangeTitle(tabId, data?.title);

                    closeModal('base');
                }
            },
            onCloseModal : () => closeModal('base'),
            onCancel     : () => closeModal('base'),
            initialState : {
                title : tabData?.title || ''
            },
            configuration : {
                name   : 'layout',
                fields : [
                    {
                        name      : 'title',
                        type      : 'string',
                        label     : t('layout-page:Tab title'),
                        className : styles.titleFieldWrapper,
                        props     : {
                            autoFocus : true
                        }
                    }
                ],
                controls : {
                    className : styles.controls,
                    submit    : {
                        title : t('layout-page:Change'),
                        props : {
                            // color : 'actionButton'
                        }
                    }
                }
            }
        });
    }

    const tabTitleCN = cx(styles.TabTitle, {
        editMode    : isEditMode,
        processing  : isProcessing,
        [className] : className
    });

    return (
        <div className = {tabTitleCN}>
            <CriticalValue
                className  = {styles.title}
                value      = {tabId}
                maxWidth   = {isSingleTab ? '160px' : '70px'}
                isDisabled = {!isBrokerConnected}
            />
            { isEditMode
                ? (
                    <div className={styles.controls}>
                        <Tooltip
                            title      = {t('translation:Edit')}
                            enterDelay = {0}
                            classes    = {{ tooltip: styles.tooltip }}
                            isDisabled = {!isBrokerConnected}
                        >
                            <div>
                                <IconButton
                                    iconType  = 'edit'
                                    className = {cx(styles.control, styles.editControl)}
                                    onClick   = {isBrokerConnected ? handleTabTitleClick : void 0}
                                />
                            </div>
                        </Tooltip>

                        { tabs?.length > 1
                            ? (
                                <Tooltip
                                    title      = {t('translation:Delete')}
                                    enterDelay = {0}
                                    classes    = {{ tooltip: styles.tooltip }}
                                    isDisabled = {!isBrokerConnected}
                                >
                                    <div>
                                        <IconButton
                                            iconType  = 'bin'
                                            className = {cx(styles.control, styles.deleteControl)}
                                            onClick   = {isBrokerConnected ? handleDeleteTab : void 0}
                                        />
                                    </div>
                                </Tooltip>
                            ) : null
                        }
                    </div>
                ) : null
            }
        </div>
    );
}

TabTitle.propTypes = {
    tabId : PropTypes.string.isRequired,
    tabs  : PropTypes.arrayOf(PropTypes.shape({
        title   : PropTypes.string.isRequired,
        widgets : PropTypes.arrayOf(PropTypes.string).isRequired
    })).isRequired,
    openModal         : PropTypes.func.isRequired,
    closeModal        : PropTypes.func.isRequired,
    onChangeTitle     : PropTypes.func,
    onDeleteTab       : PropTypes.func,
    isBrokerConnected : PropTypes.bool,
    isSingleTab       : PropTypes.bool,
    isEditMode        : PropTypes.bool,
    isProcessing      : PropTypes.bool,
    className         : PropTypes.string,
    t                 : PropTypes.func.isRequired
};

TabTitle.defaultProps = {
    onChangeTitle     : void 0,
    onDeleteTab       : void 0,
    isEditMode        : false,
    isSingleTab       : false,
    isBrokerConnected : false,
    isProcessing      : false,
    className         : ''
};

export default TabTitle;

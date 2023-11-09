import React               from 'react';
import classnames          from 'classnames/bind';
import PropTypes           from 'prop-types';

import SvgIcon             from '../SvgIcon';

import styles              from './Tabs.less';

const cx = classnames.bind(styles);

function Tabs(props) {
    const { tabs, onChange, tabsMode, isTabsDisabled, className } = props;

    function handleTabClick(tabId) {
        return () => {
            onChange({ name, value: tabId });
        };
    }

    const tabsCN = (cx(styles.Tabs, {
        [tabsMode]  : tabsMode,
        [className] : className
    }));

    return (
        <div className={tabsCN}>
            { tabs.map(tab => {
                const { value, label, icon, iconType, isActive, isDisabled } = tab || {};
                const tabCN = cx(styles.tab, 'abort-submit', {
                    active   : isActive,
                    inactive : !isActive,
                    disabled : isDisabled || isTabsDisabled
                });

                return (
                    <button
                        key       = {value}
                        className = {tabCN}
                        onClick   = {!isDisabled && !isTabsDisabled ? handleTabClick(value) : void 0}
                    >
                        {label}
                        {iconType || icon
                            ? (
                                <SvgIcon
                                    className = {styles.tabIcon}
                                    type      = {iconType ? iconType : void 0}
                                    svg       = {!iconType ? icon : void 0}
                                />
                            ) : null
                        }
                    </button>
                );
            }) }
        </div>
    );
}

Tabs.propTypes = {
    tabs : PropTypes.arrayOf(PropTypes.shape({
        value      : PropTypes.string.isRequired,
        label      : PropTypes.string.isRequired,
        iconType   : PropTypes.string,
        isActive   : PropTypes.bool,
        isDisabled : PropTypes.bool
    })).isRequired,
    onChange       : PropTypes.func.isRequired,
    tabsMode       : PropTypes.oneOf([ 'outside', '' ]),
    className      : PropTypes.string,
    isTabsDisabled : PropTypes.bool
};

Tabs.defaultProps = {
    tabsMode       : 'outside',
    className      : '',
    isTabsDisabled : false
};

export default Tabs;

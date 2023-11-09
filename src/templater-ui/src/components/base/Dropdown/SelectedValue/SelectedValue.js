import React, {
    memo
}                       from 'react';
import PropTypes        from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import classnames       from 'classnames/bind';

import Chip             from './../../Chip';
import Tooltip          from './../../Tooltip';
import SvgIcon          from './../../SvgIcon';
import CriticalValue    from './../../CriticalValue';

import styles           from './SelectedValue.less';

const cx = classnames.bind(styles);

function SelectedValue(props) {
    const {
        value, multiple, isMenuOpen, withLoader,
        withChip, defaultValue,
        classes, themeMode, t
    } = props;
    const amountToView = 1;
    const withMoreButton = withChip && value.length > 1;

    function renderMoreButton() {
        if (!withMoreButton) return null;

        return (
            <Tooltip
                title     = {(
                    <div className={styles.tooltipList}>
                        {value.slice(amountToView).map(item => (
                            <p className={styles.item} key={item?.id || item?.label}>
                                { item?.label }
                            </p>
                        ))}
                    </div>
                )}
            >
                <div className  = {styles.elseChip}>
                    <Chip
                        key        = {uuidv4()}
                        color      = 'mediumGrey'
                        tagName    = 'button'
                        size       = 'S'
                        tabIndex   = '-1'
                    >
                        {t('More')}
                    </Chip>
                </div>
            </Tooltip>
        );
    }
    const selectedValueCN = cx(styles.SelectedValue, classes.selectedValue, {
        [`${themeMode}Theme`] : themeMode,
        withMoreButton,
        notMultiple           : !multiple,
        withIcon              : value?.icon || value?.iconType,
        multiple              : !!multiple,
        menuOpen              : isMenuOpen,
        withLoader
    });

    const labelCN = cx(styles.labelWrapper, classes?.labelWrapper);

    return (
        <div className={styles.selectedValueWrapper}>
            <div className={selectedValueCN}>
                { multiple
                    ? (
                        <div className={styles.value}>
                            <div className={labelCN}>
                                { value
                                    .slice(0, amountToView)
                                    .map(item => item.label).join(', ')
                                }
                            </div>

                            { renderMoreButton() }
                        </div>
                    ) : (
                        <>
                            <div className={labelCN}>
                                <CriticalValue
                                    className = {classes?.value}
                                    value     = {value?.label || defaultValue}
                                />
                            </div>
                            { (value?.iconType || value?.icon) && !multiple && !withLoader
                                ? (
                                    <div className={styles.iconWrapper}>
                                        { value?.iconType
                                            ? (
                                                <SvgIcon
                                                    {...(value.iconProps || {})}
                                                    className = {styles.icon}
                                                    type      = {value?.iconType}
                                                />
                                            ) : value?.icon
                                        }
                                    </div>
                                ) : null
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
}

SelectedValue.propTypes = {
    multiple : PropTypes.bool,
    value    : PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.shape({
            label : PropTypes.string,
            id    : PropTypes.any
        })
    ]),
    classes : PropTypes.shape({
        selectedValue : PropTypes.string,
        labelWrapper  : PropTypes.string,
        value         : PropTypes.string
    }),
    defaultValue : PropTypes.string,
    themeMode    : PropTypes.string,
    isMenuOpen   : PropTypes.bool,
    withLoader   : PropTypes.bool,
    withChip     : PropTypes.bool,
    t            : PropTypes.func
};

SelectedValue.defaultProps = {
    value        : [],
    defaultValue : '',
    themeMode    : '',
    classes      : {},
    multiple     : false,
    isMenuOpen   : false,
    withLoader   : false,
    withChip     : true,
    t            : (text) => text
};

export default memo(SelectedValue);

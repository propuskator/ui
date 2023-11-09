import React      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import SvgIcon    from '../../SvgIcon';

import styles     from './DropdownItem.less';

const cx = classnames.bind(styles);

class DropdownItem extends React.PureComponent {
    static propTypes = {
        value        : PropTypes.oneOfType([ PropTypes.bool, PropTypes.string, PropTypes.number ]).isRequired,
        label        : PropTypes.string.isRequired,
        isSelected   : PropTypes.bool,
        onChange     : PropTypes.func.isRequired,
        className    : PropTypes.string,
        searchString : PropTypes.string,
        isFocused    : PropTypes.bool,
        multiple     : PropTypes.bool,
        icon         : PropTypes.any,
        iconType     : PropTypes.string,
        themeMode    : PropTypes.string,
        renderOption : PropTypes.func,
        item         : PropTypes.shape({}),
        iconProps    : PropTypes.shape({}),
        classes      : PropTypes.shape({
            itemLabel : PropTypes.string
        }),
        tipMessage : PropTypes.any
    };

    static defaultProps = {
        isSelected   : false,
        isFocused    : false,
        className    : '',
        searchString : '',
        multiple     : false,
        icon         : '',
        iconType     : '',
        themeMode    : '',
        renderOption : void 0,
        item         : void 0,
        iconProps    : {},
        classes      : {},
        tipMessage   : void 0
    };

    handleItemClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const { value, onChange } = this.props;

        onChange(value);
    }

    render() {
        const {
            value,
            label,
            isSelected,
            className,
            isFocused,
            multiple,
            icon,
            iconType,
            iconProps,
            renderOption,
            item,
            themeMode,
            classes,
            tipMessage
        } = this.props;

        const dropDownItemCN = cx(styles.DropdownItem, {
            [styles.selected]     : isSelected,
            [styles.focused]      : isFocused,
            [styles.multiple]     : multiple,
            [className]           : true,
            [styles.withTip]      : !!tipMessage,
            [`${themeMode}Theme`] : themeMode
        });

        return (
            <li
                key       = {value}
                className = {dropDownItemCN}
                onClick   = {this.handleItemClick}
                ref       = {node => this.dropdownItem = node}
            >
                { renderOption
                    ? renderOption(item, { value, label, isSelected })
                    : (
                        <>
                            <div className={cx(styles.label, classes.itemLabel)}>
                                { label }
                            </div>
                            { (iconType || icon) && !multiple
                                ? (
                                    <div className={styles.iconWrapper}>
                                        { iconType
                                            ? (
                                                <SvgIcon
                                                    {...(iconProps || {})}
                                                    className = {styles.icon}
                                                    type      = {iconType}
                                                />
                                            ) : icon
                                        }
                                    </div>
                                ) : null
                            }
                        </>
                    )
                }
                { tipMessage ? <div className={styles.tipBlock}>{tipMessage}</div> : null}
            </li>
        );
    }
}

export default DropdownItem;

import React, { useState }      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import InputAdornment from '@material-ui/core/InputAdornment';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import SvgIcon from '../../SvgIcon';
import Tooltip from '../../Tooltip';
import Input   from './../Input';

import styles from './InputInfo.less';

const cx = classnames.bind(styles);

function InputInfo(props) {
    const {
        inputProps, name, value, tooltipContent,
        label, ...fieldProps
    } = props;

    const { themeMode } = fieldProps;

    const InputInfoCN = cx(styles.InputInfo, {
        [props?.className]    : props?.className,
        [`${themeMode}Theme`] : themeMode
    });

    const [ open, setOpen ] = useState(false);

    function handleTooltipClose() {
        setOpen(false);
    }

    function handleTooltipOpen() {
        setOpen(true);
    }

    function renderEndAdornment() {
        return (
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <div>
                    <Tooltip
                        placement = 'bottom'
                        classes   = {{ tooltip: styles.tooltip }}
                        title = {
                            <span className={styles.tooltipText} >
                                {tooltipContent}
                            </span>
                        }
                        onClose={handleTooltipClose}
                        open={open}
                        isDisabled
                    >
                        <InputAdornment
                            position  = 'end'
                            className = {styles.inputAdornment}
                        >
                            <SvgIcon
                                className = {styles.infoIcon}
                                onClick = {handleTooltipOpen}
                                type = 'info'
                                color = 'greyDark'
                                size = {18}
                            />
                        </InputAdornment>
                    </Tooltip>
                </div>
            </ClickAwayListener>
        );
    }

    return (
        <Input
            {...(fieldProps || {})}
            name               = {name}
            value              = {value}
            label              = {label}
            className          = {InputInfoCN}
            renderEndAdornment = {renderEndAdornment}
            inputProps         = {{
                ...(inputProps || {})
            }}
            type               = 'text'
        />
    );
}

InputInfo.propTypes = {
    name           : PropTypes.string,
    value          : PropTypes.string,
    tooltipContent : PropTypes.string,
    inputProps     : PropTypes.shape({}),
    label          : PropTypes.string,
    themeMode      : PropTypes.string
};

InputInfo.defaultProps = {
    name           : void 0,
    value          : void 0,
    tooltipContent : '',
    inputProps     : {},
    label          : '',
    themeMode      : ''
};

export default InputInfo;

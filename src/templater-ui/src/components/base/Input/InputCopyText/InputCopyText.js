import React, {
    useEffect
}                       from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import { EMPTY_TEXT }   from '../../../../constants/index';
import Input            from '../Input';
import CopyTextButton   from '../../CopyTextButton';
import Typography       from '../../Typography';

import styles           from './InputCopyText.less';

const cx = classnames.bind(styles);

let timeout = null;

const SIMPLE_TOOLTIP_CLASSES = {
    tooltip : styles.tooltip
};

function InputCopyText(props) { // eslint-disable-line  max-lines-per-function
    const {
        isLoading, value, hideCopyButton, rowsMax,
        variant, portalId, t,
        ...restProps
    } = props;

    useEffect(() => () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    }, []);

    function handleInputFocus(e) {
        if (isLoading) return;

        const { target } = e;

        if (!target) return;

        timeout = setTimeout(() => {
            target?.select();   // eslint-disable-line babel/no-unused-expressions
        }, 30); // eslint-disable-line no-magic-numbers
    }

    function renderEndAdornment() {
        if (hideCopyButton || !value) return null;

        return (
            <div className={styles.endAdornment}>
                <CopyTextButton
                    className      = {styles.copyTextButton}
                    text           = {value}
                    color          = {variant === 'simple' ? 'primary500' : 'grey'}
                    tooltipClasses = {variant === 'simple' ? SIMPLE_TOOLTIP_CLASSES : void 0}
                    portalId       = {portalId}
                    t              = {t}
                />
            </div>
        );
    }

    function handleChangeInput(data, e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const inputCopyTextCN = cx(styles.InputCopyText, styles.CopyText, {
        [props?.className] : props?.className,
        withOverflow       : rowsMax > 1,
        [variant]          : variant
    });

    if (variant === 'simple') {
        return (
            <div className={styles.SimpleInputCopyText}>
                <div className={styles.valueWrapper}>
                    <Typography
                        variant   = 'body2'
                        className = {styles.value}
                        color     = 'greyDark'
                    >
                        { value || EMPTY_TEXT }
                    </Typography>
                </div>
                { renderEndAdornment() }
            </div>
        );
    }

    return (
        <Input
            {...restProps}
            value              = {value}
            className          = {inputCopyTextCN}
            label              = {variant === 'simple' ? void 0 : props?.label}
            inputType          = {'text'}
            onChange           = {handleChangeInput}
            withError          = {false}
            onFocus            = {handleInputFocus}
            renderEndAdornment = {rowsMax > 1 ? void 0 : renderEndAdornment}
            rowsMax            = {rowsMax}
            readOnly
            multiline
        />
    );
}

InputCopyText.propTypes = {
    value          : PropTypes.any,
    label          : PropTypes.string,
    portalId       : PropTypes.string,
    isLoading      : PropTypes.bool,
    hideCopyButton : PropTypes.bool,
    rowsMax        : PropTypes.number,
    variant        : PropTypes.oneOf([ 'simple', 'default', '' ]),
    t              : PropTypes.func
};

InputCopyText.defaultProps = {
    value          : '',
    label          : '',
    portalId       : void 0,
    isLoading      : false,
    hideCopyButton : false,
    rowsMax        : 1,
    variant        : '',
    t              : (text) => text
};

export default InputCopyText;

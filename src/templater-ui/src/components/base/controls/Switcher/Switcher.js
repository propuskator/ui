/* eslint-disable  react/prop-types, no-shadow, no-magic-numbers, react/jsx-no-bind, react/no-unused-prop-types */
import React, { useMemo } from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';

import CriticalValue      from '../../CriticalValue';
import CircularProgress   from '../../CircularProgress';

import { EMPTY_TEXT }     from '../../../../constants';

import styles             from './Switcher.less';

const cx = classnames.bind(styles);

function Switcher(props) {
    const {
        className, value, name,
        onChange, isDisabled, isProcessing, themeMode
    } = props;
    const isEmpty = !props?.options?.length;
    const options = isEmpty ? [ '' ] : props?.options;
    const selectedOptionIndex = options.findIndex(option => option === value);

    function handleChangeOption(value) {
        if (onChange && !isDisabled && !isProcessing || isEmpty) onChange({ value, name });
    }

    const OptionsList = useMemo(() =>
        options.slice(0, 3).map((label, index, visibleOptions) => (
            <div
                className = {cx(styles.option, {
                    selected         : !isEmpty && label === value,
                    withRightDivider : options?.length > 1 &&
                        ![ selectedOptionIndex, selectedOptionIndex - 1, visibleOptions.length - 1 ].includes(index)
                })}
                onClick   = {() => !isEmpty && label !== value && handleChangeOption(label)}
                key       = {index} // eslint-disable-line react/no-array-index-key
            >
                <CriticalValue
                    value     = {label || EMPTY_TEXT}
                    className = {styles.value}
                />
            </div>
        ), [ options, value ]));

    const switcherCN = cx(styles.Switcher, { [`${themeMode}Theme`]: themeMode, [className]: className });

    return (
        <div className = {switcherCN}>
            <div className={styles.optionsWrapper}>
                <div className = {cx(styles.options, { disabled: isDisabled || isEmpty, processing: isProcessing })}>
                    {OptionsList}
                </div>
            </div>
            <div className = {styles.processingIndicator}>
                { isProcessing
                    ? <CircularProgress color={'greyDark'} />
                    : null
                }
            </div>
        </div>
    );
}

Switcher.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    options      : PropTypes.array,
    name         : PropTypes.string,
    themeMode    : PropTypes.string,
    onChange     : PropTypes.func,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool
};

Switcher.defaultProps = {
    className    : '',
    value        : EMPTY_TEXT,
    options      : [],
    name         : '',
    themeMode    : '',
    onChange     : void 0,
    isDisabled   : false,
    isProcessing : false
};

export default Switcher;

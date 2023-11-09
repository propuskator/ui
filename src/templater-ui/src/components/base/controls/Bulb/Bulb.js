import React                        from 'react';
import PropTypes                    from 'prop-types';
import classnames                   from 'classnames/bind';

import BulbIcon                     from '../../icons/BulbIcon';
import CircularProgress             from '../../CircularProgress';

import styles                       from './Bulb.less';

const cx = classnames.bind(styles);

function Bulb(props) {
    const {
        className, value, name, onChange, isSettable,
        isProcessing, loaderSize, brightness, themeMode
    } = props;

    function handleClick() {
        if (isProcessing || !isSettable) return;

        onChange({ value: !value, name });
    }

    const bulbCN = cx(styles.Bulb, { [className]: className });

    return (
        <div className={bulbCN} onClick={handleClick}>
            { isProcessing
                ? (
                    <div
                        className = {styles.loaderWrapper}
                        style     = {{
                            width  : `${loaderSize}px`,
                            height : `${loaderSize}px`
                        }}
                    >
                        <CircularProgress
                            size='Full'
                            color='greyDark'
                        />
                    </div>
                ) : null
            }
            <BulbIcon
                isDisabled = {!isSettable}
                isDark     = {!value}
                brightness = {brightness}
                themeMode  = {themeMode}
            />
        </div>
    );
}

Bulb.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.bool,
    isSettable   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    onChange     : PropTypes.func,
    name         : PropTypes.string,
    brightness   : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    loaderSize   : PropTypes.number,
    themeMode    : PropTypes.string
};

Bulb.defaultProps = {
    className    : '',
    value        : false,
    isSettable   : false,
    isProcessing : false,
    onChange     : void 0,
    brightness   : 1,
    loaderSize   : 10,
    name         : '',
    themeMode    : ''
};

export default Bulb;

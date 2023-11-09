import React, { useEffect, useState }   from 'react';
import PropTypes                        from 'prop-types';
import classnames                       from 'classnames/bind';

import { default as MaterialSlider }    from '@material-ui/core/Slider';

import styles                           from './Slider.less';

const cx = classnames.bind(styles);

function Slider(props) {
    const {
        step, min, max, className, value, name,
        isDisabled, isProcessing, onChange, onChangeSlider,
        valueLabelDisplay, color, marks, themeMode
    } = props;

    const [ sliderValue, setSliderValue ] = useState(value);

    useEffect(() => {
        setSliderValue(value);
    }, [ value ]);

    function handleChangeSliderValue(e, val) {
        if (isProcessing) return;
        if (onChangeSlider) onChangeSlider(e, val);
        setSliderValue(val);
    }

    function handleCommitValue(e, commitValue) {
        if (e) e.preventDefault();
        if (e) e.stopPropagation();

        if (isProcessing) return;
        if (!onChange) return;

        onChange({ value: commitValue, name, onError: ({ prevValue }) => setSliderValue(prevValue) });
    }

    const sliderCN = cx(styles.Slider, {
        [className]           : className,
        disabled              : isDisabled,
        [color]               : color,
        [`${themeMode}Theme`] : themeMode
    });

    return (
        <MaterialSlider
            className     = {sliderCN}
            value         = {sliderValue}
            min           = {+min}
            max           = {+max}
            step          = {+step}
            component     = 'button'
            valueLabelDisplay = {valueLabelDisplay}
            marks             = {marks}
            onChange          = {handleChangeSliderValue}
            onChangeCommitted = {handleCommitValue}
            disabled          = {isDisabled}
            classes           = {{
                rail      : styles.rail,
                track     : styles.track,
                thumb     : styles.thumb,
                active    : styles.active,
                disabled  : styles.disabled,
                markLabel : styles.markLabel
            }}
        />
    );
}

Slider.propTypes = {
    className         : PropTypes.string,
    value             : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    step              : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    min               : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    max               : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    onChange          : PropTypes.func,
    onChangeSlider    : PropTypes.func,
    name              : PropTypes.string,
    isDisabled        : PropTypes.bool,
    isProcessing      : PropTypes.bool,
    valueLabelDisplay : PropTypes.bool,
    color             : PropTypes.oneOf([ 'primary600', 'primaryGreen' ]),
    marks             : PropTypes.arrayOf(PropTypes.shape({
        value : PropTypes.number,
        label : PropTypes.string
    })),
    themeMode : PropTypes.string
};

Slider.defaultProps = {
    className         : '',
    value             : '',
    name              : '',
    step              : 1,
    min               : 0,
    max               : 10,
    onChange          : void 0,
    onChangeSlider    : void 0,
    isDisabled        : false,
    isProcessing      : false,
    valueLabelDisplay : 'off',
    color             : 'primary600',
    marks             : void 0,
    themeMode         : ''
};

export default Slider;

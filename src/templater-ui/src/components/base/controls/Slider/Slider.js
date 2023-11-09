import React, { useEffect, useState }   from 'react';
import PropTypes                        from 'prop-types';
import classnames                       from 'classnames/bind';

import SliderControl                    from '../../Slider';
import CriticalValue                    from '../../CriticalValue';

import { isNumeric }                    from '../../../../utils/numbers';
import { EMPTY_TEXT }                   from '../../../../constants';

import styles                           from './Slider.less';

const cx = classnames.bind(styles);

function Slider(props) {
    const { className, value, advanced, name, isDisabled, isProcessing, onChange, themeMode } = props;
    const { step, min, max } = advanced || {};

    const [ sliderValue, setSliderValue ] = useState(value);

    useEffect(() => {
        setSliderValue(value);
    }, [ value ]);

    function handleChangeSliderValue(e, val) {
        setSliderValue(val);
    }

    // eslint-disable-next-line no-shadow
    function handleCommitValue({ value, name }) {
        onChange({ value, name, onError: ({ prevValue }) => setSliderValue(prevValue) });
    }

    const isSliderDisabled = isDisabled || isProcessing;
    const sliderCN = cx(styles.Slider, { className, disabled: isSliderDisabled, [`${themeMode}Theme`]: themeMode });

    return (
        <div className={sliderCN}>
            <CriticalValue
                className  = {styles.value}
                value      = {isNumeric(sliderValue) ? sliderValue : EMPTY_TEXT}
            />
            <SliderControl
                className         = {styles.sliderControl}
                value             = {sliderValue}
                name              = {name}
                min               = {min}
                max               = {max}
                step              = {step}
                onChange          = {handleCommitValue}
                onChangeSlider    = {handleChangeSliderValue}
                isDisabled        = {isSliderDisabled}
            />
        </div>
    );
}

Slider.propTypes = {
    className : PropTypes.string,
    value     : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    advanced  : PropTypes.shape({
        step : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        min  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        max  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    onChange     : PropTypes.func,
    name         : PropTypes.string,
    themeMode    : PropTypes.string,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool
};

Slider.defaultProps = {
    className    : '',
    value        : '',
    name         : '',
    themeMode    : '',
    onChange     : void 0,
    isDisabled   : false,
    isProcessing : false
};

export default Slider;

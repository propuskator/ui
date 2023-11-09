import React, {
    useEffect, useMemo,
    useState
} from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import Bulb                 from '../Bulb';
import Slider               from '../../Slider';
import CriticalValue        from '../../CriticalValue';
import Typography           from '../../Typography';
import { isNumeric }        from '../../../../utils/numbers';
import { EMPTY_TEXT }       from '../../../../constants';

import styles               from './BulbBrightness.less';

const cx = classnames.bind(styles);

function BulbBrightness(props) {
    const {
        className, values, topics, advanced, themeMode, onChange,
        isSettable, isDisabled, isProcessing, t
    } = props;

    const [ bulbValue, sliderValue ] = values;
    const [ bulbTopic, sliderTopic ] = topics;

    const [ _sliderValue, _setSliderValue ] = useState(sliderValue);

    useEffect(() => {
        _setSliderValue(sliderValue);
    }, [ sliderValue ]);

    function handleChangeSliderValue(_, val) {
        _setSliderValue(val);
    }

    function handleCommitSliderValue({ name, value, onError }) {
        onChange({
            name,
            value,
            onError : () => {
                onError({ prevValue: sliderValue });
                _setSliderValue(sliderValue);
            }
        });
    }

    const bulbBrightnessCN = cx(styles.BulbBrightness, {
        [className]           : className,
        [`${themeMode}Theme`] : themeMode
    });

    const brightness = useMemo(
        () =>
            Math.min(Math.max((_sliderValue - advanced?.min) / (advanced?.max - advanced?.min), 0), 1),
        [ _sliderValue, advanced ]
    );

    const isDarkTheme = themeMode === 'dark';

    return (
        <div className={bulbBrightnessCN}>
            <div className={cx(styles.bulbWrapper, { active: bulbValue })}>
                <Bulb
                    className    = {styles.bulb}
                    value        = {bulbValue}
                    name         = {bulbTopic}
                    isSettable   = {isSettable && !isDisabled}
                    isProcessing = {isProcessing}
                    brightness   = {brightness}
                    loaderSize   = {30}
                    onChange     = {onChange}
                    themeMode    = {themeMode}
                    t            = {t}
                />
                <Typography className={styles.bulbTitle}>
                    {t('Bulb')}
                </Typography>
                <Typography className={styles.bulbSubtitle}>
                    {bulbValue ? 'ON' : 'OFF'}
                </Typography>
            </div>
            <Typography className={styles.subtitle}>
                {t('Bulb brightness')}
            </Typography>
            <div className={styles.sliderSection}>
                <div className={styles.sliderWrapper}>
                    <Slider
                        value          = {sliderValue}
                        name           = {sliderTopic}
                        max            = {advanced?.max}
                        min            = {advanced?.min}
                        step           = {advanced?.step}
                        isDisabled     = {!bulbValue || isDisabled || isProcessing}
                        onChange       = {handleCommitSliderValue}
                        onChangeSlider = {handleChangeSliderValue}
                        color          = {'primaryGreen'}
                    />
                </div>
                <CriticalValue
                    className = {cx(styles.valueText, { darkTheme: isDarkTheme, disabled: !bulbValue })}
                    value     = {isNumeric(_sliderValue) ? _sliderValue : EMPTY_TEXT}
                />
            </div>
        </div>
    );
}

BulbBrightness.propTypes = {
    className : PropTypes.string,
    values    : PropTypes.string.isRequired,
    topics    : PropTypes.arrayOf(PropTypes.string).isRequired,
    advanced  : PropTypes.shape({
        max  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        min  : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        step : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
    }).isRequired,
    onChange     : PropTypes.func,
    isSettable   : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    themeMode    : PropTypes.string,
    t            : PropTypes.func
};

BulbBrightness.defaultProps = {
    className    : '',
    isSettable   : false,
    isDisabled   : false,
    isProcessing : false,
    onChange     : void 0,
    themeMode    : '',
    t            : (text) => text
};

export default BulbBrightness;

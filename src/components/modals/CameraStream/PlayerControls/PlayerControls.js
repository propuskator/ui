import React, {
    useState
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import IconButton               from 'templater-ui/src/components/base/IconButton';
import Tooltip                  from 'templater-ui/src/components/base/Tooltip';
import Slider                   from 'templater-ui/src/components/base/Slider';

import SvgIcon                  from 'Base/SvgIcon';

import styles                   from './PlayerControls.less';

const cx = classnames.bind(styles);

const TOOLTIP_CLASSES = {
    tooltip : styles.tooltip
};

function PlayerControls(props) {    // eslint-disable-line  max-lines-per-function
    const {
        t, className,
        onPause, onPlay, onChangeVolume
    } = props;

    const [ status, setStatus ] = useState('play');
    const [ volume, setVolume ] = useState(props?.volume || 0);

    function handlePlay() {
        if (onPlay) onPlay();
        setStatus('play');
    }

    function handlePause() {
        if (onPause) onPause();
        setStatus('pause');
    }

    function handleChangeVolume({ value } = {}) {
        setVolume(value);
        onChangeVolume(value);
    }

    const playerControlsCN = cx(styles.PlayerControls, {
        [className] : className
    });

    return (
        <div className={playerControlsCN}>
            <Tooltip
                title     = {status === 'pause' ? t('cameras-page:Play') : t('cameras-page:Pause')}
                placement = 'bottom'
                classes   = {TOOLTIP_CLASSES}
            >
                <div>
                    <IconButton
                        className = {styles.playPauseControl}
                        onClick   = {status === 'pause' ? handlePlay : handlePause}
                    >
                        <SvgIcon
                            className = {styles.icon}
                            type      = {status === 'pause' ? 'play' : 'pause'}
                            color     = 'black'
                        />
                    </IconButton>
                </div>
            </Tooltip>

            <div className={styles.volumeControlWrapper}>
                <SvgIcon
                    className = {styles.icon}
                    type      = 'volume'
                    color     = 'black'
                />
                <Slider
                    className         = {styles.slider}
                    value             = {volume}
                    min               = {0}
                    max               = {10}
                    step              = {1}
                    onChange          = {handleChangeVolume}
                    valueLabelDisplay = {'auto'}
                    isDisabled        = {false}
                />
            </div>
        </div>
    );
}

PlayerControls.propTypes = {
    t              : PropTypes.func.isRequired,
    onPause        : PropTypes.func.isRequired,
    onPlay         : PropTypes.func.isRequired,
    onChangeVolume : PropTypes.func.isRequired,
    className      : PropTypes.string
};

PlayerControls.defaultProps = {
    className : void 0
};

export default PlayerControls;

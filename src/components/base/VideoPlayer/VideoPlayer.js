import React, {
    useImperativeHandle,
    useRef
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import IconButton               from 'templater-ui/src/components/base/IconButton';
import Slider                   from 'templater-ui/src/components/base/Slider';

import SvgIcon                  from 'Base/SvgIcon';
import useVideoPlayer           from 'Base/VideoPlayer/useVideoPlayer';

import styles                   from './VideoPlayer.less';

const cx = classnames.bind(styles);

function VideoPlayer(props) {
    const { className, sources, isAutoPlay, forwardedRef, FallbackComponent, classes } = props;

    const playerRef = useRef();

    const {
        isPlaying,
        isError,
        progress,
        volume,
        togglePlay,
        startPlayer,
        stopPlayer,
        changeSeek,
        changeVolume
    } = useVideoPlayer(playerRef, { isAutoPlay });

    useImperativeHandle(forwardedRef, () => ({
        startPlayer,
        stopPlayer
    }));

    function handleSeekChange(_, value) {
        changeSeek(value);
    }

    function handleChangeVolume(_, value) {
        changeVolume(value);
    }

    const videoPlayerCN = cx(styles.VideoPlayer, [ className ]);

    return (
        <div className={videoPlayerCN} >
            {
                isError
                    ? FallbackComponent
                    : <video
                        className = {cx(styles.player, [ classes?.player ])}
                        onClick   = {togglePlay}
                        ref       = {playerRef}
                    >
                        {
                            sources.map(source => (
                                <source src={source?.src} type={source?.type} key={source?.src} />
                            ))
                        }
                    </video>
            }

            <div className={styles.controls}>
                <div className={styles.playerControlsWrapper}>
                    <IconButton
                        className = {styles.playPauseControl}
                        onClick   = {stopPlayer}
                    >
                        <SvgIcon
                            className = {styles.stopIcon}
                            type      = 'stop'
                            color     = 'black'
                        />
                    </IconButton>

                    <IconButton
                        className = {styles.playPauseControl}
                        onClick   = {togglePlay}
                    >
                        <SvgIcon
                            className = {styles.icon}
                            type      = {isPlaying ? 'pause' : 'play'}
                            color     = 'black'
                        />
                    </IconButton>
                </div>

                <Slider
                    className         = {styles.seek}
                    min               = {0}
                    step              = {1}
                    max               = {100}
                    value             = {progress}
                    onChangeSlider    = {handleSeekChange}
                    isDisabled        = {false}
                />

                <div className={styles.volumeControlWrapper}>
                    <SvgIcon
                        className = {styles.icon}
                        type      = 'volume'
                        color     = 'black'
                    />

                    <Slider
                        className         = {styles.volume}
                        value             = {volume}
                        min               = {0}
                        max               = {1}
                        step              = {0.1}
                        onChangeSlider    = {handleChangeVolume}
                        isDisabled        = {false}
                    />
                </div>

            </div>
        </div>
    );
}

VideoPlayer.propTypes = {
    className : PropTypes.string,
    sources   : PropTypes.arrayOf(PropTypes.shape({
        src  : PropTypes.string,
        type : PropTypes.string
    })).isRequired,
    isAutoPlay        : PropTypes.bool,
    forwardedRef      : PropTypes.object,
    FallbackComponent : PropTypes.node,
    classes           : PropTypes.object
};

VideoPlayer.defaultProps = {
    className         : void 0,
    isAutoPlay        : false,
    forwardedRef      : {},
    FallbackComponent : null,
    classes           : {}
};

export default VideoPlayer;

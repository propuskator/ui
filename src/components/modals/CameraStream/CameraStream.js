/* eslint-disable no-magic-numbers,  babel/no-unused-expressions, no-shadow */
import React, {
    useEffect,
    useRef,
    useState
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import globalEnterHandler       from 'templater-ui/src/utils/eventHandlers/globalEnterHandler';
import Typography               from 'templater-ui/src/components/base/Typography';
import IconButton               from 'templater-ui/src/components/base/IconButton';
import Loader                   from 'templater-ui/src/components/base/Loader';
import Button                   from 'templater-ui/src/components/base/Button';

import config                   from 'Config';
import sessionManager           from 'Utils/sessions';
import SvgIcon                  from 'Base/SvgIcon';
import JSMpeg                   from './jsmpeg.min.js'; // https://github.com/phoboslab/jsmpeg
import PlayerControls           from './PlayerControls';

import styles                   from './CameraStream.less';

const cx = classnames.bind(styles);

const MS_IN_MIN = 60 * 1000;
const VIDEO_LOAD_TIMEOUT = 2 * MS_IN_MIN; // 2 min
let timeout = null;

function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}

function CameraStream(props) {    // eslint-disable-line  max-lines-per-function
    const {
        name, closeModal, level, isTopModal, t,
        onClose, link, poster
    } = props;

    const playerRef = useRef({ });
    const timerRef = useRef({ });

    const [ showLoader, setShowLoader ] = useState(true);
    const [ isError, setIsError ] = useState(false);
    const [ isPosterError, setIsPosterError ] = useState(false);
    const [ loadingAttempt, setLoadingAttempt ] = useState(1);
    const [ posterId, setPosterId ] = useState(generateRandomId());

    useEffect(() => {
        function submitOnEnter() {
            handleSubmit();
        }

        globalEnterHandler.register(submitOnEnter);

        return () => {
            globalEnterHandler.unregister(submitOnEnter);
            if (timeout) clearTimeout(timeout);
            clearErrorTimer();
        };
    }, [ ]);

    useEffect(() => {
        initStream();

        return () => {
            destroyStream(playerRef);

            if (onClose) onClose();
        };
    }, [  ]);

    function startErrorTimer() {
        timerRef.current = setTimeout(() => {
            setIsError(true);
        }, VIDEO_LOAD_TIMEOUT);
    }

    function clearErrorTimer() {
        clearTimeout(timerRef?.current);

        timerRef.current =  void 0;
    }

    function destroyStream(ref) {
        if (typeof ref?.current?.destroy === 'function') {
            ref?.current?.destroy();
        }
    }

    async function initStream() {
        const { token } = await sessionManager.getSession() || { };

        destroyStream(playerRef);
        startErrorTimer();

        playerRef.current =  new JSMpeg.Player(link, {
            canvas    : document.getElementById('canvas'),
            protocols : token,
            onPlay    : () => {
                clearErrorTimer();
                setShowLoader(false);
            }
        });
    }

    function handleRefreshStream() {
        setIsError(false);

        timeout = setTimeout(() => {
            setLoadingAttempt(prev => prev + 1);
            setIsPosterError(false);
            initStream();
            setPosterId(generateRandomId());
        }, 0);
    }

    function handleCloseModal() {
        closeModal(name);
    }

    async function handleSubmit() {
        // pass
    }

    function handlePauseStream() {
        if (typeof playerRef?.current?.pause === 'function') {
            playerRef?.current?.pause();
        }
    }

    function handlePlayStream() {
        if (typeof playerRef?.current?.play === 'function') {
            playerRef?.current?.play();
        }
    }

    function handleChangeVolume(volume) {
        if (playerRef?.current) {
            playerRef.current.volume = volume;
        }
    }

    function handlePosterLoadError() {
        setIsPosterError(true);
    }

    const cameraStreamCN = cx(styles.CameraStream, {
        [`${level}Level`] : level,
        topModal          : isTopModal
    });

    const posterUrl = poster ? `${config.apiUrl}/${poster}` : void 0;

    return (
        <div className={cameraStreamCN}>
            <IconButton
                className = {styles.closeButton}
                iconType  = 'cross'
                onClick   = {handleCloseModal}
            />
            <Typography
                className = {styles.title}
                variant   = 'headline3'
                color     = 'black'
            >
                { t('cameras-page:Camera\'s stream') }
            </Typography>
            <div className={styles.content}>
                { !isPosterError && posterUrl
                    ? (
                        <img
                            key       = {posterId}
                            className = {cx(styles.posterPreview, { hidden: isError || !showLoader })}
                            src       = {`${posterUrl}?cache-killer=${posterId}`}
                            onError   = {handlePosterLoadError}
                        />
                    ) : null
                }
                { showLoader && !isError
                    ? (
                        <div className={styles.loaderWrapper}>
                            <Loader size = 'S' />
                        </div>
                    ) : null
                }
                { !isError
                    ? (
                        <>
                            <canvas id='canvas' className={styles.canvas} />
                            { !showLoader && !isError
                                ? (
                                    <PlayerControls
                                        key            = {loadingAttempt}
                                        t              = {t}
                                        onPause        = {handlePauseStream}
                                        onPlay         = {handlePlayStream}
                                        volume         = {playerRef?.current?.volume}
                                        onChangeVolume = {handleChangeVolume}
                                    />
                                ) : null
                            }
                        </>
                    ) : (
                        <div className={styles.errorMessage}>
                            <SvgIcon
                                className = {styles.errorIcon}
                                type      = 'connectionError'
                            />
                            <Typography
                                variant   = 'caption1'
                                color     = 'black'
                                className = {styles.message}
                            >
                                {t('cameras-page:Something went wrong. Error has been occurred while displaying camera\'s stream.')}
                            </Typography>

                            <Button
                                className = {styles.refreshButton}
                                onClick   = {handleRefreshStream}
                                size      = 'M'
                            >
                                { t('cameras-page:Refresh') }
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

CameraStream.propTypes = {
    onClose    : PropTypes.func,
    closeModal : PropTypes.func,
    name       : PropTypes.string.isRequired,
    link       : PropTypes.string.isRequired,
    isTopModal : PropTypes.bool,
    level      : PropTypes.oneOf([ 'first', 'second' ]),
    t          : PropTypes.func.isRequired,
    poster     : PropTypes.string
};

CameraStream.defaultProps = {
    isTopModal : false,
    level      : 'first',
    closeModal : void 0,
    onClose    : void 0,
    poster     : void 0
};

export default CameraStream;

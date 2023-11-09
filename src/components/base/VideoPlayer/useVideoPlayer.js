/* eslint-disable no-magic-numbers */
import { useEffect, useState } from 'react';

function useVideoPlayer(videoElement, options = {}) {
    const [ isError, setIsError ] = useState(false);

    const [ playerState, setPlayerState ] = useState({
        isPlaying : false,
        volume    : 1,
        progress  : 0
    });

    useEffect(() => {
        if (videoElement.current) {
            const removeHandlers = initHandlers(videoElement.current);

            if (options.isAutoPlay) setPlayerState(prev => ({ ...prev, isPlaying: true }));

            return removeHandlers;
        }

        console.error('[useVideoPlayer]: Video element not found');
    }, [ ]);

    useEffect(() => {
        if (!isError) {
            if (playerState.isPlaying) {
                _handlePlay();
            } else {
                videoElement.current.pause();
            }
        }
    }, [ playerState.isPlaying, videoElement.current, isError ]);

    function initHandlers(videoNode) {
        videoNode.ontimeupdate = handleProgressUpdate;
        videoNode.onended = stopPlayer;

        const source = videoNode.querySelector('source:last-child');

        if (source)  {
            source.addEventListener('error', handlePlayerError);
        }

        return () => {
            videoNode.ontimeupdate = null;
            videoNode.onended = null;
            source.removeEventListener('error', handlePlayerError);
        };
    }

    function handlePlayerError() {
        setIsError(true);
    }

    function _handlePlay() {
        videoElement.current.play().catch(() => {
           setPlayerState(prev => ({ ...prev, isPlaying: false }));
        });
    }

    function togglePlay() {
        setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }

    function changeVolume(volume) {
        if (!isError) {
            videoElement.current.volume = volume;
            setPlayerState(prev => ({ ...prev, volume }));
        }
    }

    function handleProgressUpdate() {
        const progress = (videoElement.current?.currentTime / videoElement.current?.duration) * 100;

        setPlayerState(prev => ({ ...prev, progress }));
    }

    function changeSeek(progressValue) {
        try {
            videoElement.current.currentTime = videoElement.current?.duration / 100 * progressValue;
            setPlayerState(prev => ({ ...prev, progress: progressValue }));
        } catch (e) {
            // pass
        }
    }

    function startPlayer() {
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
    }

    function stopPlayer() {
        setPlayerState(prev => ({ ...prev, isPlaying: false }));
        changeSeek(0);
    }

    return {
        ...playerState,
        isError,
        togglePlay,
        changeVolume,
        changeSeek,
        stopPlayer,
        startPlayer
    };
}

export default useVideoPlayer;

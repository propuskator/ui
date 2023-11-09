/* eslint-disable react/jsx-no-bind */
import React, {
    useEffect,
    useRef,
    useState
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';


import IconButton               from 'templater-ui/src/components/base/IconButton';
import Typography               from 'templater-ui/src/components/base/Typography';
import Loader                   from 'templater-ui/src/components/base/Loader';

import VideoPlayer              from 'Base/VideoPlayer';
import Image                    from 'Base/Image';
import Slider                   from 'Base/Slider';
import SvgIcon                  from 'Base/SvgIcon';

import sessionManager           from 'Utils/sessions';
import { formatDate }           from 'Utils/date';

import styles                   from './AccessLogMedia.less';

const cx = classnames.bind(styles);

function AccessLogMedia(props) {
    const {
        name, mediaType, media, isTopModal, closeModal, level, t
    } = props;

    const videoPlayerRefs = useRef([]);

    const [ mediaItems, setMediaItems ] = useState([]);

    useEffect(() => {
        processMediaItems();
    }, [ media ]);

     async function processMediaItems() {
         const { token } = await sessionManager.getSession() || { };
         const processedItems = media?.map(item => ({ ...item, src: `/${item?.path}?token=${token}` }));

         setMediaItems(processedItems);
     }

    function handleCloseModal() {
        closeModal(name);
    }

    function renderFallback() {
        return (<div className={styles.imageFallback}>
            <SvgIcon type='emptyList' />
            <span
                className={styles.fallbackText}
            >
                {
                    mediaType === 'videos'
                        ? t('access-logs-page:Failed to load video')
                        : t('access-logs-page:Failed to load image')
                }
            </span>
        </div>);
    }

    function renderLoader() {
         return (
             <Loader
                 className = {styles.loader}
                 size      = 'S'
             />
         );
    }

    function handleSlideChange({ prevIndex, currIndex }) {
        if (videoPlayerRefs.current[prevIndex]) videoPlayerRefs.current[prevIndex].stopPlayer();
        if (videoPlayerRefs.current[currIndex]) videoPlayerRefs.current[currIndex].startPlayer();
    }

    function renderSlides() {
        return mediaItems.map(({ src, originCreatedAt }, index) => (
            <div className={styles.mediaSlide} key={src} >
                {
                    mediaType === 'videos'
                        ? <VideoPlayer
                            className  = {styles.videoPlayerWrapper}
                            classes    = {{
                                player : styles.player
                            }}
                            isAutoPlay = {index === 0}
                            sources    = {[ {
                                src,
                                type : 'video/mp4'
                            } ]}
                            FallbackComponent = {renderFallback()}
                            forwardedRef = {el => videoPlayerRefs.current[index] = el}
                        />
                        : <div className={styles.imageWrapper}>
                            <Image
                                className         = {styles.mediaImage}
                                FallbackComponent = {renderFallback()}
                                LoaderComponent   = {renderLoader()}
                                src               = {src}
                            />
                        </div>
                }
                <span className={styles.mediaDate}>{formatDate({ date: originCreatedAt })}</span>
            </div>
        ));
    }

    const accessLogMediaCN = cx(styles.AccessLogMedia, {
        topModal          : isTopModal,
        [`${level}Level`] : level
    });

    return (
        <div className={accessLogMediaCN} key={name}>
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
                {
                    t(mediaType === 'videos'
                        ? 'access-logs-page:Access point video'
                        : 'access-logs-page:Access point picture')
                }
            </Typography>

            <Slider
                slides        = {renderSlides()}
                onSlideChange = {handleSlideChange}
            />
        </div>
    );
}

AccessLogMedia.propTypes = {
    name       : PropTypes.string.isRequired,
    isTopModal : PropTypes.bool.isRequired,
    media      : PropTypes.array.isRequired,
    mediaType  : PropTypes.oneOf([ 'videos', 'frames' ]).isRequired,
    level      : PropTypes.oneOf([ 'first', 'second' ]),
    closeModal : PropTypes.func.isRequired,
    t          : PropTypes.func.isRequired
};

AccessLogMedia.defaultProps = {
    level : 'first'
};

export default React.memo(AccessLogMedia);

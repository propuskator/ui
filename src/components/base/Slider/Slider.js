/* eslint-disable react/no-array-index-key */
import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import PropTypes            from 'prop-types';
import classnames           from 'classnames/bind';

import Loader               from 'templater-ui/src/components/base/Loader';
import IconButton           from 'templater-ui/src/components/base/IconButton';

import SvgIcon              from 'Base/SvgIcon';

import styles               from './Slider.less';

const cx = classnames.bind(styles);

// eslint-disable-next-line max-lines-per-function
function Slider(props) {
    const { className, slides, onSlideChange } = props;

    const slidesWrapperRef = useRef();

    const [ carousel, setCarousel ] = useState({
        currentSlide : 0,
        translateX   : 0,
        isLoading    : false
    });

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize);

        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    function handleWindowResize() {
        const slideWidth = getSlideWidth();

        setCarousel(prev => ({
            ...prev,
            // eslint-disable-next-line no-magic-numbers
            translateX : prev.currentSlide * slideWidth * -1
        }));
    }

    function getSlideWidth() {
        return slidesWrapperRef.current.clientWidth;
    }

    function handleOnSlideChange(prevIndex, currIndex) {
        if (onSlideChange) onSlideChange({ prevIndex, currIndex });
    }

    function handleClickNext() {
        if (carousel.currentSlide < slides.length - 1) {
            handleOnSlideChange(carousel.currentSlide, carousel.currentSlide + 1);

            setCarousel(prev => ({
                currentSlide : prev.currentSlide + 1,
                translateX   : prev.translateX - getSlideWidth()
            }));
        }
    }

    function handleClickPrev() {
        if (carousel.currentSlide > 0) {
            handleOnSlideChange(carousel.currentSlide, carousel.currentSlide - 1);

            setCarousel(prev => ({
                currentSlide : prev.currentSlide - 1,
                translateX   : prev.translateX + getSlideWidth()
            }));
        }
    }

    const SliderCN = cx(styles.Slider, [ className ]);

    const isPrevHidden = carousel.currentSlide === 0;
    const isNextHidden = carousel.currentSlide === slides.length - 1;

    return (
        <div className={SliderCN}>
            <div className={styles.wrapper} >
                <div className={styles.sliderControls}>
                    <IconButton
                        className  = {cx({ [styles.controlIconHidden]: isPrevHidden })}
                        onClick    = {handleClickPrev}
                        isDisabled = {carousel.isLoading}
                    >
                        <SvgIcon
                            className = {styles.prevIcon}
                            type      = 'arrowRightThin'
                        />
                    </IconButton>
                    <IconButton
                        className  = {cx({ [styles.controlIconHidden]: isNextHidden })}
                        onClick    = {handleClickNext}
                        isDisabled = {carousel.isLoading}
                        size='M'
                    >
                        <SvgIcon
                            className = {styles.nextIcon}
                            type      = 'arrowRightThin'
                        />
                    </IconButton>
                </div>

                <div className={styles.slides} ref={slidesWrapperRef} >
                    {
                        carousel.isLoading
                            ? (
                                <div className={styles.loaderWrapper}>
                                    <Loader size = 'S' />
                                </div>
                            )
                            : null
                    }
                    {
                        slides.map((slide, index) =>
                            (<div
                                className = {styles.slide}
                                style     = {{
                                    transform : `translateX(${carousel.translateX}px)`
                                }}
                                key       = {index}
                            >
                                {slide}
                            </div>))
                    }
                </div>
            </div>

            <div className={styles.pagination}>
                {carousel.currentSlide + 1}/{slides.length}
            </div>
        </div>
    );
}

Slider.propTypes = {
    className     : PropTypes.string,
    slides        : PropTypes.array.isRequired,
    onSlideChange : PropTypes.func
};

Slider.defaultProps = {
    className     : '',
    onSlideChange : void 0
};

export default React.memo(Slider);

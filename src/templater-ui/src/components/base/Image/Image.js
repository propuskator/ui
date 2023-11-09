import React, {
    useState,
    useEffect
}                 from 'react';
import PropTypes  from 'prop-types';


function ImageComponent(props) {
    const {
        src,
        FallbackComponent,
        LoaderComponent,
        className,
        size,
        withResize,
        ...rest
    } = props;

    const [ errored, setErrored ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);
    const [ fullSrc, setFullSrc ] = useState();

    function handleError() {
        setErrored(true);
    }

    function handleLoad() {
        setLoaded(true);
    }

    useEffect(() => {
        if (withResize && src?.size) return;

        if (typeof src === 'string' && src?.includes('node-static')) {
            let srcToLoad = src;

            if (withResize) {
                let srcParts = (src?.split('.') || []);
                const lastIndex = srcParts?.length - 1;

                srcParts = srcParts
                    ?.map((part, index) => {
                        const isLast = index === lastIndex;

                        if (!isLast) return part;

                        const { width = 80, height = 80 } = size || {}; // eslint-disable-line no-magic-numbers
                        const firstPart = width + 'X' + height + '.';   // eslint-disable-line  prefer-template
                        const lastPart = srcParts[lastIndex] || '';

                        return firstPart + lastPart;
                    });

                srcToLoad = srcParts?.join('.') || src;
            }

            setFullSrc(srcToLoad);

            if (!srcToLoad) return setErrored(true);

            const imageLoader = new Image();

            imageLoader.src = srcToLoad;
            imageLoader.onload = handleLoad;
            imageLoader.onerror = handleError;
            setErrored(false);

            return () => {
                imageLoader.src = null;
                imageLoader.onload = null;
                imageLoader.onerror = null;
            };
        }

        setFullSrc(src);
        setLoaded(true);
    }, [ src ]);

    if (loaded && !errored && fullSrc) {
        return (
            <img
                src       = {fullSrc}
                className = {className}
                onError   = {handleError}
                onLoad    = {handleLoad}
                {...rest}
            />
        );
    }

    if (!loaded && !errored && LoaderComponent && src) {
        return LoaderComponent;
    }

    return FallbackComponent;
}

ImageComponent.propTypes = {
    src        : PropTypes.string,
    withResize : PropTypes.bool,
    size       : PropTypes.shape({
        width  : PropTypes.number,
        height : PropTypes.number
    }),
    FallbackComponent : PropTypes.node,
    LoaderComponent   : PropTypes.node,
    className         : PropTypes.string
};

ImageComponent.defaultProps = {
    src  : '',
    size : {
        width  : 100,
        height : 100
    },
    FallbackComponent : null,
    LoaderComponent   : null,
    withResize        : true,
    className         : ''
};

export default React.memo(ImageComponent);

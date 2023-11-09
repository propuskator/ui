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
        if (src?.size) return;
        else if (typeof src === 'string' && src?.includes('node-static')) {
            let srcParts = (src?.split('.') || []);
            const lastIndex = srcParts?.length - 1;

            srcParts = srcParts
                ?.map((part, index) => {
                    const isLast = index === lastIndex;

                    if (!isLast) return part;

                    const { width = 80, height = 80 } = size || {}; // eslint-disable-line no-magic-numbers
                    const lastPart = srcParts[lastIndex];

                    return `${width}X${height}.${lastPart || ''}`;
                });

            const srcWithSize = srcParts?.join('.') || src;

            setFullSrc(srcWithSize);

            const imageLoader = new Image();

            imageLoader.src = srcWithSize;
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
    src  : PropTypes.string,
    size : PropTypes.shape({
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
    className         : ''
};

export default React.memo(ImageComponent);

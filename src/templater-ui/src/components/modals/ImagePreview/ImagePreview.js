import React, {
    useEffect
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import Image                    from '../../base/Image/Image';
import Loader                   from '../../base/Loader/Loader';
import IconButton               from '../../base/IconButton';

import withCloseOnEsc           from '../withCloseOnEsc';

import styles                   from './ImagePreview.less';

const cx = classnames.bind(styles);

function ImagePreview(props) {
    const {
        classes, src, name, withResize,
        closeModal, onCloseModal,
        withCloseByClick
    } = props;

    useEffect(() => {
        if (withCloseByClick) {
            function closeModalByClick() { // eslint-disable-line  no-inner-declarations
                handleCloseModal();

                if ([ 'BUTTON', 'A' ].includes(document?.activeElement?.nodeName)) {
                    document.activeElement.blur();
                }
            }
            document.addEventListener('click', closeModalByClick);

            return () => {
                document.removeEventListener('click', closeModalByClick);
            };
        }
    }, [ withCloseByClick ]);

    function handleCloseModal() {
        closeModal(name);

        if (onCloseModal) onCloseModal(name);
    }

    const layoutWidgetCN = cx(styles.ImagePreview, [ classes?.rootPreview ]);

    return (
        <div className={layoutWidgetCN}>
            <IconButton
                className = {cx(styles.closeButton, classes.closeButton)}
                iconType  = 'cross'
                onClick   = {handleCloseModal}
            />

            <Image
                className         = {cx(styles.image, [ classes?.img ])}
                src               = {src}
                withResize        = {withResize}
                LoaderComponent = {(
                    <div className={styles.loaderWrapper}>
                        <Loader size='XS' />
                    </div>
                )}
            />
        </div>
    );
}

ImagePreview.propTypes = {
    src     : PropTypes.string.isRequired,
    name    : PropTypes.string.isRequired,
    classes : PropTypes.shape({
        root : PropTypes.string,
        img  : PropTypes.string
    }),
    withResize       : PropTypes.bool,
    closeModal       : PropTypes.func,
    onCloseModal     : PropTypes.func,
    withCloseByClick : PropTypes.bool
};

ImagePreview.defaultProps = {
    classes          : {},
    withResize       : false,
    closeModal       : void 0,
    onCloseModal     : void 0,
    withCloseByClick : false
};

export default withCloseOnEsc(ImagePreview);

import React, {
    useState,
    useEffect
}                         from 'react';
import PropTypes          from 'prop-types';
import classnames         from 'classnames/bind';
import Dialog             from '@material-ui/core/Dialog';

import {
    getScreenParams
}                         from 'templater-ui/src/utils/screen';

import { MODALS_BY_NAME } from 'Modals/ModalContainer/modals';

import styles             from './SecondLevelModal.less';

const cx = classnames.bind(styles);

const MODAL_CLASSES = {
    root  : styles.modalRoot,
    paper : styles.modalPaper
};

function SecondLevelModal(props) {
    const { modalData, closeModal, withBoxshadow, t } = props;
    const [ isInitialized, setIsInitialized ] = useState(false);
    const [ modalStyles, setModalStyles ] = useState({});

    const Modal         = MODALS_BY_NAME[modalData?.name];
    const isVisible     = modalData && Modal;

    useEffect(() => {
        if (!isVisible) {
            setModalStyles({});

            return setIsInitialized(false);
        }

        const { calcModalPosition, offsetData } = props;
        // very bad fix of very strange bug: modal open without focused field in another scenario =(
        const modalNodeData = modalData?.width && modalData?.height
            ? ({
                width  : modalData?.width,
                height : modalData?.height
            })
            : null;
        const modalStyles   = modalData?.styles || null;    /* eslint-disable-line no-shadow */

        if (!modalStyles || !modalNodeData) return setIsInitialized(true);
        if (calcModalPosition) {
            const stylesToSet = calcModalPosition(modalNodeData);

            setIsInitialized(true);

            return setModalStyles(stylesToSet);
        }

        const { width, height } = getScreenParams();
        const MODAL_X_OFFSET = offsetData && 'x' in offsetData
            ? offsetData.x
            : 10; // eslint-disable-line no-magic-numbers
        const MODAL_Y_OFFSET = offsetData && 'y' in offsetData
            ? offsetData.y
            : 10; // eslint-disable-line no-magic-numbers

        const modalLeftEnd      = modalStyles.left + modalNodeData.width;
        const modalBottomEnd    = modalStyles.top + modalNodeData.height;
        const isCorrectPosition = ((width - MODAL_X_OFFSET) > modalLeftEnd)
                && ((height - MODAL_Y_OFFSET) > modalBottomEnd);

        if (isCorrectPosition) {
            setModalStyles({
                position : 'absolute',
                top      : `${modalStyles.top}px`,
                left     : `${modalStyles.left}px`
            });
        }

        setIsInitialized(true);
    }, [ isVisible ]);

    function handleOverlayClick() {
        if (!isVisible) return;

        if (closeModal) closeModal();
    }

    const modalWrapperCN = cx(styles.modalWrapper, {
        initialized : isInitialized,
        withBoxshadow
    });


    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            open                 = {!!isVisible}
            scroll               = {'paper'}
            classes              = {MODAL_CLASSES}
        >
            { isVisible
                ? (
                    <div
                        className = {cx(styles.SecondLevelModal, { visible: isInitialized })}
                        onClick   = {handleOverlayClick}
                    >
                        <div
                            className = {modalWrapperCN}
                            style     = {{ ...modalStyles }}
                            onClick   = {(e) => e.stopPropagation()}    // eslint-disable-line react/jsx-no-bind
                        >
                            <Modal
                                {...(modalData?.props || {})}
                                name       = {modalData?.name}
                                level      = 'second'
                                closeModal = {closeModal}
                                t          = {t}
                                isTopModal
                            />
                        </div>
                    </div>
                ) : null
            }
        </Dialog>
    );
}

SecondLevelModal.propTypes = {
    modalData : PropTypes.shape({
        name   : PropTypes.string,
        props  : PropTypes.shape({}),
        styles : PropTypes.shape({
            top  : PropTypes.number,
            left : PropTypes.number
        })
    }),
    offsetData : PropTypes.shape({
        x : PropTypes.number,
        y : PropTypes.number
    }),
    closeModal        : PropTypes.func.isRequired,
    calcModalPosition : PropTypes.func,
    withBoxshadow     : PropTypes.bool,
    t                 : PropTypes.func.isRequired
};

SecondLevelModal.defaultProps = {
    calcModalPosition : void 0,
    modalData         : void 0,
    offsetData        : void 0,
    withBoxshadow     : true
};

export default React.memo(SecondLevelModal);

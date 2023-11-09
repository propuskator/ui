import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';
import Dialog                   from '@material-ui/core/Dialog';

import {
    MODALS_BY_NAME
}                               from './modals';

import styles                   from './ModalContainer.less';

const cx = classNames.bind(styles);


class ModalContainer extends PureComponent {
    static propTypes = {
        closeModal : PropTypes.func.isRequired,
        openModal  : PropTypes.func.isRequired,
        list       : PropTypes.arrayOf(PropTypes.shape({
            name  : PropTypes.string.isRequired,
            props : PropTypes.shape({})
        })),
        modals            : PropTypes.object,
        history           : PropTypes.object.isRequired,
        classes           : PropTypes.object,
        t                 : PropTypes.func,
        withoutBorders    : PropTypes.bool,
        transparentModals : PropTypes.array
    };


    static defaultProps = {
        list              : [],
        modals            : {},
        classes           : {},
        t                 : void 0,
        withoutBorders    : false,
        transparentModals : []
    }

    constructor(props) {
        super(props);

        props.history.listen(this.handleChangeHistory);
    }

    handleChangeHistory = (location, action) => {
        const { closeModal } = this.props;
        const isGoBack = [ 'POP' ]?.includes(action);

        if (isGoBack) closeModal('', true);
    }

    handleCloseModal = (name) => {
        const { closeModal } = this.props;

        closeModal(name);
    }

    render() {
        const { list, modals, openModal, t, withoutBorders, transparentModals } = this.props;
        const modalsConfig = {
            ...MODALS_BY_NAME,
            ...modals
        };
        const modalsList = list
            .map(modalData => ({
                Component : modalsConfig[modalData.name],
                ...modalData
            }))
            .filter(modal => modal.Component);
        const isModalOpen = !!modalsList.length;

        const modalContainerCN = cx({
            ModalContainer,
            open : !!modalsList.length
        });

        return (
            <div className={modalContainerCN}>
                <div className = {styles.overlay} />
                { isModalOpen && modalsList.length
                    ? (modalsList.map(({ scrollType = 'body', Component, name, createdAt, props = {} }, index) => {
                        const isTransparent = transparentModals?.includes(name);
                        const paperStyles = cx(styles.modalPaper, {
                            withoutBorders         : withoutBorders || isTransparent,
                            [props.classes?.paper] : props.classes?.paper,
                            transparent            : isTransparent
                        });

                        return (
                            <Dialog
                                key = {`${name}${createdAt}`}
                                disableEscapeKeyDown
                                onBackdropClick = {() => this.handleCloseModal(name)} // eslint-disable-line react/jsx-no-bind, max-len
                                open            = {!!true}
                                scroll          = {scrollType}
                                classes         = {{
                                    root  : cx(styles.modalRoot, props.classes?.modalRoot),
                                    paper : paperStyles
                                }}
                            >
                                <Component
                                    closeModal = {this.handleCloseModal}    /* eslint-disable-line react/jsx-handler-names, max-len */
                                    openModal  = {openModal}
                                    name       = {name}
                                    level      = 'first'
                                    isTopModal = {index === modalsList.length - 1}
                                    t          = {t}
                                    {...props}
                                />
                            </Dialog>
                        );
                    })) : null
                }
            </div>
        );
    }
}

export default React.memo(ModalContainer);

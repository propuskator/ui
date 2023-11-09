/* eslint-disable  babel/no-unused-expressions */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import globalEnterHandler       from '../../../utils/eventHandlers/globalEnterHandler';
import FormControls             from '../../shared/FormControls';
import Typography               from '../../base/Typography';
import IconButton               from '../../base/IconButton';

import styles                   from './Confirm.less';

const cx = classnames.bind(styles);

export default class Confirm extends PureComponent {
    static propTypes = {
        onSubmit     : PropTypes.func.isRequired,
        onCancel     : PropTypes.func,
        onClose      : PropTypes.func,
        forwardRef   : PropTypes.shape({ current: PropTypes.shape({}) }),
        title        : PropTypes.string.isRequired,
        message      : PropTypes.any.isRequired,
        confirmLabel : PropTypes.string,
        // cancelLabel  : PropTypes.string.isRequired,
        isTopModal   : PropTypes.bool.isRequired,
        level        : PropTypes.oneOf([ 'first', 'second' ]),
        size         : PropTypes.oneOf([ 'L', '' ])
    }

    static defaultProps = {
        onClose      : void 0,
        onCancel     : void 0,
        forwardRef   : void 0,
        level        : 'first',
        confirmLabel : 'OK',
        size         : ''
    }

    constructor(props) {
        super(props);
        this.submitButtonRef = React.createRef({});

        this. state = {
            isProcessing : false
        };
    }

    componentDidMount() {
        this.submitButtonRef?.current?.focus();

        const { forwardRef } = this.props;

        if (forwardRef) forwardRef.current =  this.modal;
        globalEnterHandler.register(this.submitOnEnter);
    }

    componentWillUnmount() {
        const { onClose } = this.props;

        if (onClose) onClose();
        globalEnterHandler.unregister(this.submitOnEnter);
    }

    handleSubmit = async (e) => {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.setState({
            isProcessing : true
        });

        if (e) e.preventDefault();
        if (e) e.stopPropagation();
        const { onSubmit } = this.props;

        try {
            await onSubmit();
        } finally {
            this.isProcessing = false;
            this.setState({
                isProcessing : false
            });
        }
    };

    handleCancel = () => {
        const { onCancel } = this.props;

        onCancel();
    }

    submitOnEnter = () => {
        this.handleSubmit();
    }

    render() {
        const {
            title,
            message,
            confirmLabel,
            size,
            // cancelLabel,
            isTopModal,
            level
        } = this.props;
        const { isProcessing } = this.state;

        const confirmCN = cx(styles.Confirm, {
            topModal          : isTopModal,
            [`${level}Level`] : level,
            [`size${size}`]   : size
        });

        return (
            <div className={confirmCN} ref={node => this.modal = node}>
                <div className={styles.content}>
                    <Typography
                        className = {styles.title}
                        variant   = 'headline3'
                        color     = 'black'
                    >
                        {title}
                    </Typography>
                    <IconButton
                        iconType  = 'cross'
                        className = {styles.closeButton}
                        onClick   = {this.handleCancel}
                    />
                    <Typography
                        className = {styles.message}
                        variant   = 'body2'
                    >
                        { message }
                    </Typography>
                    <div className={styles.form}>
                        <FormControls
                            controls         = {{
                                submit : {
                                    title : confirmLabel,
                                    props : {
                                        forwardRef : this.submitButtonRef,
                                        color      : 'red'
                                    }
                                }
                            }}
                            onSubmit         = {this.handleSubmit}
                            onCancel         = {this.handleCancel}
                            isFormProcessing = {isProcessing}
                            isSubmitDisabled = {isProcessing}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

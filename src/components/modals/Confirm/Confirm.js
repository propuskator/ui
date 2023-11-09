/* eslint-disable  babel/no-unused-expressions */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import FormControls             from 'templater-ui/src/components/shared/FormControls';
import Typography               from 'templater-ui/src/components/base/Typography';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import styles                   from './Confirm.less';

const cx = classnames.bind(styles);

export default class Confirm extends PureComponent {
    static propTypes = {
        onSubmit     : PropTypes.func.isRequired,
        onCancell    : PropTypes.func.isRequired,
        onClose      : PropTypes.func,
        forwardRef   : PropTypes.shape({ current: PropTypes.shape({}) }),
        title        : PropTypes.string.isRequired,
        message      : PropTypes.any.isRequired,
        confirmLabel : PropTypes.string.isRequired,
        cancelLabel  : PropTypes.string.isRequired,
        isTopModal   : PropTypes.bool.isRequired,
        level        : PropTypes.oneOf([ 'first', 'second' ]),
        size         : PropTypes.oneOf([ 'L', '' ]),
        controlColor : PropTypes.string
    }

    static defaultProps = {
        onClose      : void 0,
        forwardRef   : void 0,
        level        : 'first',
        size         : '',
        controlColor : 'red'
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
    }

    componentWillUnmount() {
        const { onClose } = this.props;

        if (onClose) onClose();
    }

    handleSubmit = async (e) => {
        if (this.isProcessing) return;

        this.isProcessing = true;
        this.setState({
            isProcessing : true
        });

        if (e) e.preventDefault();
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

    handleCancell = () => {
        const { onCancell } = this.props;

        onCancell();
    }

    render() {
        const {
            title,
            message,
            confirmLabel,
            size,
            cancelLabel,
            isTopModal,
            level,
            controlColor
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
                        onClick   = {this.handleCancell}
                    />
                    <Typography
                        className = {styles.message}
                        variant   = 'body2'
                    >
                        { message }
                    </Typography>
                    <form onSubmit={this.handleSubmit} className={styles.form}>
                        <FormControls
                            controls         = {{
                                cancell : {
                                    title : cancelLabel,
                                    props : {
                                        color : 'greyDark'
                                    }
                                },
                                submit : {
                                    title : confirmLabel,
                                    props : {
                                        forwardRef : this.submitButtonRef,
                                        color      : controlColor
                                    }
                                }
                            }}
                            onSubmit         = {this.handleSubmit}
                            onCancell        = {this.handleCancell}
                            isFormProcessing = {isProcessing}
                            isSubmitDisabled = {isProcessing}
                        />
                    </form>
                </div>
            </div>
        );
    }
}

import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames';

import IconButton               from './../../../base/IconButton';
import Icon                     from './../../../base/SvgIcon';
import Button                   from './../../../base/Button';

import styles                   from './Toast.less';

const cx = classnames.bind(styles);

class Toast extends PureComponent {
    static propTypes = {
        type             : PropTypes.oneOf([ 'success', 'warning', 'error', 'info' ]).isRequired,
        message          : PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]).isRequired,
        title            : PropTypes.string,
        id               : PropTypes.string.isRequired,
        className        : PropTypes.string,
        onClose          : PropTypes.func,
        hideByTimeout    : PropTypes.bool,
        withCloseAbility : PropTypes.bool,
        controls         : PropTypes.arrayOf(PropTypes.shape({
            label   : PropTypes.string,
            onClick : PropTypes.func,
            props   : PropTypes.shape({})
        })),
        timeout : PropTypes.number
    }

    static defaultProps = {
        className        : '',
        title            : void 0,
        timeout          : 5000,
        hideByTimeout    : true,
        withCloseAbility : true,
        controls         : void 0,
        onClose          : () => {}
    }

    componentDidMount() {
        const { id, timeout, onClose, hideByTimeout } = this.props;

        if (!hideByTimeout) return;

        this.timeout = setTimeout(() => onClose(id), timeout);
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
    }

    handleClose = () => {
        const { id, onClose } = this.props;

        onClose(id);
    }

    renderActionControls() {
        const { withCloseAbility } = this.props;

        if (!withCloseAbility) return [];

        return (
            <div className={styles.actionControls}>
                <IconButton
                    className = {styles.closeIconButton}
                    onClick   = {this.handleClose}
                >
                    <Icon
                        type      = 'close'
                        className = {styles.closeIcon}
                    />
                </IconButton>
            </div>
        );
    }

    render() {
        const {
            type,
            title,
            message,
            className,
            controls,
            withCloseAbility
        } = this.props;
        const toastCN = cx(styles.Toast, {
            [className]        : className,
            [styles.withClose] : withCloseAbility,
            [styles[type]]     : type

        });

        return (
            <div className={toastCN}>
                <div className={styles.content}>
                    { title
                        ? <div className={styles.title}>{title}</div>
                        : null
                    }
                    <div className={styles.messageWrapper}>
                        { message }
                    </div>
                    { this.renderActionControls() }
                </div>
                { controls?.length
                    ? (
                        <div
                            className={cx(styles.controls, {
                                [styles.singleControl] : controls?.length === 1
                            })}>
                            { controls.map(({
                                onClick, label, props : controlProps = {}
                            }) => (
                                <Button
                                    key       = {label}
                                    className = {styles.control}
                                    size      = 'S'
                                    onClick   = {onClick}
                                    {...controlProps}
                                >
                                    {label}
                                </Button>
                            )) }
                        </div>
                    )
                    : null
                }
            </div>
        );
    }
}

export default Toast;

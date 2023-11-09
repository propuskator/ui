import React, {
    PureComponent
}                               from 'react';
import PropTypes                from 'prop-types';
import classNames               from 'classnames/bind';

import styles                   from './ErrorMessage.less';

const cx = classNames.bind(styles);


class ErrorMessage extends PureComponent {
    static propTypes = {
        className : PropTypes.string,
        error     : PropTypes.string
    };

    static defaultProps = {
        className : '',
        error     : ''
    }

    render() {
        const {
            className,
            error
        } = this.props;
        const errorMessageCN = cx({
            ErrorMessage,
            [styles.visible] : !!error,
            [className]      : className
        });


        return (
            <div className={errorMessageCN}>
                <div className={styles.text}>
                    {error}
                </div>
            </div>
        );
    }
}


export default ErrorMessage;

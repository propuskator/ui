import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Button           from '../Button';

import styles           from './PushButton.less';

const cx = classnames.bind(styles);

function PushButton(props) {
    const { onClick, isProcessing, isDisabled, className } = props;

    return (
        <Button
            onClick    = {onClick}
            isDisabled = {isDisabled}
            isLoading  = {isProcessing}
            className  = {cx('PushButton', [ className, { processing: isProcessing } ])}
            color      = 'primary600'
            size       = 'XS'
        >
            Push
        </Button>
    );
}

PushButton.propTypes = {
    onClick      : PropTypes.func,
    isProcessing : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    className    : PropTypes.string
};

PushButton.defaultProps = {
    onClick      : void 0,
    isProcessing : false,
    isDisabled   : false,
    className    : ''
};


export default PushButton;

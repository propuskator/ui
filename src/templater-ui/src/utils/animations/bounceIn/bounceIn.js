import React             from 'react';
import PropTypes         from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import styles            from './bounceIn.less';

function BounceIn({ children, timeout, visible, ...props }) {
    return (
        <CSSTransition
            {...props}
            in         = {visible}
            timeout    = {timeout}
            classNames = {styles}
            unmountOnExit
        >
            {children}
        </CSSTransition>
    );
}

BounceIn.propTypes = {
    children : PropTypes.element.isRequired,
    timeout  : PropTypes.number,
    visible  : PropTypes.bool
};

BounceIn.defaultProps = {
    timeout : 300,
    visible : false
};

export default BounceIn;

import React             from 'react';
import PropTypes         from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import styles            from './fade.less';

function Fade({ children, timeout, visible, ...props }) {
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

Fade.propTypes = {
    children : PropTypes.element.isRequired,
    timeout  : PropTypes.number,
    visible  : PropTypes.bool
};

Fade.defaultProps = {
    timeout : 300,
    visible : false
};

export default Fade;

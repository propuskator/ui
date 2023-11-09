import React             from 'react';
import PropTypes         from 'prop-types';
import { CSSTransition } from 'react-transition-group';

import styles            from './ToastsAnimation.less';

function ToastsAnimation({ children, ...props }) {
    return (
        <CSSTransition
            {...props}
            timeout    = {500}
            classNames = {styles}
        >
            {children}
        </CSSTransition>
    );
}

ToastsAnimation.propTypes = {
    children : PropTypes.element.isRequired,
    timeout  : PropTypes.number
};

ToastsAnimation.defaultProps = {
    timeout : 300
};

export default ToastsAnimation;

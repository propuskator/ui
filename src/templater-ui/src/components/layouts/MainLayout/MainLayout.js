/* eslint-disable react/require-default-props */
import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import * as KEY_CODES           from './../../../constants/keyCodes';
import styles                   from './MainLayout.less';

const cx = classnames.bind(styles);


class MainLayout extends PureComponent {
    static propTypes = {
        children        : PropTypes.element.isRequired,
        cookieComponent : PropTypes.element,
        toastsComponent : PropTypes.element,
        modalsComponent : PropTypes.element,
        className       : PropTypes.string
    }

    static defaultProps = {
        cookieComponent : void 0,
        toastsComponent : void 0,
        modalsComponent : void 0,
        className       : void 0
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('keyup', this.handleKeyPressed);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keyup', this.handleKeyPressed);
    }

    resetFocus = () => {
        const isResetFocus = [ 'BUTTON', 'A' ].includes(document?.activeElement?.nodeName);

        if (isResetFocus) {
            document.activeElement.blur();
        }
    }

    handleDocumentClick = () => {
        this.resetFocus();
    }

    handleKeyPressed = (e) => {
        if (e.keyCode === KEY_CODES.ESCAPE) {
            this.resetFocus();
        }
    }

    render() {
        const {
            children, className,
            cookieComponent, toastsComponent, modalsComponent
        } = this.props;

        return (
            <div className={cx(styles.MainLayout, className)}>
                {children}
                { cookieComponent || null }
                { toastsComponent || null }
                { modalsComponent || null }
            </div>
        );
    }
}

export default MainLayout;

import React          from 'react';
import classnames     from 'classnames/bind';

import * as KEY_CODES from 'Constants/keyCodes';

import styles         from './styles.less';

const cx = classnames.bind(styles);

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withAllowTabMoveOnlyInComponent(ChildComponent) {
    class HOComponent extends React.PureComponent {
        componentDidMount() {
            this.firstInputRef.addEventListener('keydown', this.handleFirstInputKeyDown);
            this.lastInputRef.addEventListener('keydown', this.handleLastInputKeyDown);
        }

        componentWillUnmount() {
            this.firstInputRef.removeEventListener('keydown', this.handleFirstInputKeyDown);
            this.lastInputRef.removeEventListener('keydown', this.handleLastInputKeyDown);
        }

        handleFirstInputKeyDown = (e) => {
            if ((e.keyCode === KEY_CODES.TAB && e.shiftKey)) {
                e.preventDefault();

                this.lastInputRef.focus();
            }
        }

        handleLastInputKeyDown = (e) => {
            if ((e.keyCode === KEY_CODES.TAB && !e.shiftKey)) {
                e.preventDefault();

                this.firstInputRef.focus();
            }
        }

        render() {
            return (
                <div
                    className={cx(styles.withAllowTabMoveOnlyInComponent, 'scroll-content')}  // need this to fix select scroll on mobile
                >
                    <input
                        className   = {styles.input}
                        ref         = {node => this.firstInputRef = node}
                    />
                    <ChildComponent {...this.props} />
                    <input
                        className   = {styles.input}
                        ref         = {node => this.lastInputRef = node}
                    />
                </div>
            );
        }
    }

    HOComponent.displayName = `HOC-withAllowTabMoveOnlyInComponent-(${getDisplayName(HOComponent)})`;

    return HOComponent;
}

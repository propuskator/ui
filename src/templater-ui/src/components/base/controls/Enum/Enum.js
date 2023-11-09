import React, {
    PureComponent
}                             from 'react';
import PropTypes              from 'prop-types';
import classnames             from 'classnames/bind';

import Dropdown               from './../../Dropdown';
import CriticalValue          from './../../CriticalValue';

import styles                 from './Enum.less';

const cx = classnames.bind(styles);

class EnumControl extends PureComponent {
    static propTypes = {
        value        : PropTypes.string,
        isError      : PropTypes.bool,
        options      : PropTypes.string,
        isProcessing : PropTypes.bool,
        unit         : PropTypes.string,
        onInteract   : PropTypes.func
    }

    static defaultProps = {
        value        : '—',
        options      : '',
        unit         : '',
        isError      : false,
        isProcessing : false,
        onInteract   : void 0
    }

    handleOutOfFormClick = (e) => {
        const { isProcessing, isError, onInteract } = this.props;

        if (isProcessing || !this.enumRef) return;
        if (!this.enumRef.contains(e.target)) {
            if (isError && onInteract) onInteract();
        }
    }

    render() {
        const {
            isError,
            options,
            isProcessing,
            unit
        } = this.props;
        const enumCN = cx(styles.EnumControl, {
            withUnit   : unit,
            processing : isProcessing
        });

        return (
            <div className={enumCN}>
                <div
                    className = {styles.dropdownWrapper}
                    ref       = {node => this.enumRef = node}
                >
                    <Dropdown
                        {...this.props}
                        options       = {(options || '').split(',').map(value => ({
                            value,
                            label : value
                        }))}
                        errorMessage  = {isError ? 'error' : ''}
                        isProcessing  = {isProcessing}
                        disabled      = {isProcessing}
                        withError     = {false}
                        isRequired
                    />
                </div>
                { unit
                    ? (
                        <div className={styles.unitWrapper}>
                            <CriticalValue
                                value     = {unit}
                                className = {styles.unitField}
                                maxWidth  = {'60px'}
                            />
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default EnumControl;

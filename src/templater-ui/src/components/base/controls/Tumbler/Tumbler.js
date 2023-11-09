import React, { useCallback } from 'react';
import PropTypes              from 'prop-types';
import classnames             from 'classnames/bind';

import Loader       from '../../Loader/';

import styles                 from './Tumbler.less';

const cx = classnames.bind(styles);

function Tumbler(props) {
    const {
        className, value, onChange, isDisabled, isSettable, isProcessing,
        themeMode
    } = props;

    const isClickDisabled = isDisabled || !isSettable || isProcessing;

    const handleClick = useCallback(() => {
        if (isClickDisabled) return;
        onChange({ value: !value });
    }, [ onChange, isClickDisabled ]);

    const tumblerCN = cx(styles.Tumbler, {
        [className]           : className,
        [`${themeMode}Theme`] : themeMode,
        active                : value,
        processing            : isProcessing,
        disabled              : isDisabled
    });

    return (
        <div className={styles.tumblerWrapper}>
            { isProcessing
                ? (
                    <div className={styles.loaderWrapper}>
                        <Loader  size='XS' color='grey' />
                    </div>
                ) : null
            }
            <div className={tumblerCN} onClick={handleClick}>
                <div className={styles.sectionOff} />
                <div className={styles.sectionOn} />
            </div>
        </div>
    );
}

Tumbler.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.bool.isRequired,
    onChange     : PropTypes.func.isRequired,
    isProcessing : PropTypes.bool,
    isSettable   : PropTypes.bool,
    themeMode    : PropTypes.string,
    isDisabled   : PropTypes.bool
};

Tumbler.defaultProps = {
    className    : '',
    themeMode    : '',
    isProcessing : false,
    isSettable   : false,
    isDisabled   : false
};

export default Tumbler;

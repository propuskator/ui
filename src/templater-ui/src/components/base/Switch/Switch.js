import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';
import Switch           from '@material-ui/core/Switch';

import CircularProgress from './../CircularProgress';

import styles           from './Switch.less';

const cx = classnames.bind(styles);

function MaterialSwitch(props) {
    const {
        value, name, onChange, isDisabled, isProcessing,
        className, themeMode, variant
    } = props;

    function handleChange() {
        if (isProcessing || isDisabled) return;

        if (onChange) onChange({ name, value: !value });
    }

    const switchWrapperCN = cx(styles.switchWrapper, {
        checked               : !!value,
        unchecked             : !value,
        disabled              : !!isDisabled,
        [variant]             : variant,
        [className]           : className,
        [`${themeMode}Theme`] : themeMode
    });

    return (
        <div className={switchWrapperCN}>
            <Switch
                checked    = {!!value}
                onChange   = {handleChange}
                name       = {name}
                disabled   = {isDisabled}
                inputProps = {{ 'aria-label': 'secondary checkbox' }}
                classes    = {{
                    root  : styles.root,
                    track : styles.track
                }}
            />
            { isProcessing
                ? (
                    <div className={cx(styles.loaderWrapper, { hidden: !isProcessing })}>
                        <CircularProgress
                            thickness = {3}
                            color     = {variant === 'secondary' ?  'greyDark' : 'white'}
                        />
                    </div>
                ) : null
            }
        </div>
    );
}

MaterialSwitch.propTypes = {
    value        : PropTypes.bool.isRequired,
    name         : PropTypes.string,
    onChange     : PropTypes.func,
    isDisabled   : PropTypes.bool,
    isProcessing : PropTypes.bool,
    className    : PropTypes.string,
    themeMode    : PropTypes.string,
    variant      : PropTypes.oneOf([ 'primary', 'secondary' ])
};

MaterialSwitch.defaultProps = {
    name         : '',
    onChange     : void 0,
    isDisabled   : false,
    isProcessing : false,
    variant      : 'primary',
    className    : '',
    themeMode    : ''
};

export default MaterialSwitch;

import React                        from 'react';
import PropTypes                    from 'prop-types';
import classnames                   from 'classnames/bind';

import SvgIcon                      from '../../SvgIcon';
import Button                       from '../../Button';
import Typography                   from '../../Typography';

import styles  from './Door.less';

const cx = classnames.bind(styles);

function Door(props) {
    const { className, value, name, onChange, isProcessing, isDisabled, t } = props;

    function handleClick() {
        if (isProcessing || isDisabled) return;

        onChange({ value: !value, name });
    }

    const doorCN = cx(styles.Door, {
        [className] : className
    });

    return (
        <Button
            className  = {doorCN}
            size       = 'S'
            onClick    = {handleClick}
            isLoading  = {isProcessing}
            isDisabled = {isDisabled}
            color      = {value ? 'lightRed' : 'primary600'}
        >
            <div className={styles.content}>
                <Typography
                    className = {styles.text}
                    variant   = 'body2'
                >
                    {
                        t(value ? 'Close' : 'Open')
                    }
                </Typography>
                <SvgIcon
                    className = {styles.lockIcon}
                    type      = {value ? 'lockOpened' : 'lock'}
                    color     = 'white'
                />
            </div>
        </Button>
    );
}

Door.propTypes = {
    className    : PropTypes.string,
    value        : PropTypes.bool,
    isProcessing : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    onChange     : PropTypes.func,
    name         : PropTypes.string,
    t            : PropTypes.func
};

Door.defaultProps = {
    className    : '',
    value        : false,
    isProcessing : false,
    isDisabled   : false,
    onChange     : void 0,
    name         : '',
    t            : (text) => text
};

export default Door;

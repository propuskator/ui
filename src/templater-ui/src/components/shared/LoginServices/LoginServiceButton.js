import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Button           from '../../base/Button';
import SvgIcon          from '../../base/SvgIcon';
import Typography       from '../../base/Typography';

import styles           from './LoginServiceButton.less';

const cx = classnames.bind(styles);

function LoginServiceButton(props) {
    const {
        className, iconType, isDisabled, onClick, children
    } = props;

    const loginServiceButtonCN = cx(styles.LoginServiceButton, [ className ]);

    return (
        <Button
            className  = {loginServiceButtonCN}
            color      = 'greyMedium'
            variant    = 'outlined'
            onClick    = {onClick}
            isDisabled = {isDisabled}
        >
            <div className={styles.wrapper}>
                <SvgIcon
                    className = {styles.icon}
                    type      = {iconType}
                    color     = ''
                />
                <Typography
                    className = {styles.text}
                    variant   = 'body1'
                >
                    {children}
                </Typography>
            </div>
        </Button>
    );
}

LoginServiceButton.propTypes = {
    className  : PropTypes.string,
    iconType   : PropTypes.string,
    isDisabled : PropTypes.bool,
    onClick    : PropTypes.func.isRequired,
    children   : PropTypes.any
};

LoginServiceButton.defaultProps = {
    className  : '',
    iconType   : '',
    isDisabled : false,
    children   : null
};

export default LoginServiceButton;

import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import Switch           from './../Switch';
import Typography       from './../../Typography';
import ErrorMessage     from './../../ErrorMessage';

import styles           from './SwitchFormField.less';

const cx = classnames.bind(styles);


function SwitchFormField(props) {   /* eslint-disable-line max-lines-per-function */
    const {
        label,
        size,
        className,
        onChange,
        name,
        value,
        isDisabled,
        isProcessing,
        withError,
        errorMessage,
        classes
    } = props;

    const switchFormFieldCN = cx(styles.SwitchFormField, {
        withLabel       : label,
        [`size${size}`] : !!size,
        [className]     : className,
        processing      : isProcessing,
        disabled        : isDisabled
    });

    return (
        <div className={switchFormFieldCN}>
            <div className={cx(styles.body, { [classes.body]: classes.body })}>
                { label
                    ? (
                        <Typography variant='body2' className={cx(styles.label, [ classes.label ])}>
                            {label}
                        </Typography>
                    ) : null
                }
                <Switch
                    onChange   = {onChange}
                    name       = {name}
                    value      = {value}
                    isDisabled = {isDisabled}
                />
            </div>

            { withError ? <ErrorMessage error={errorMessage} /> : null }
        </div>
    );
}

SwitchFormField.propTypes = {
    label        : PropTypes.string,
    size         : PropTypes.oneOf([ 'M', 'L', '' ]),
    className    : PropTypes.string,
    value        : PropTypes.string,
    name         : PropTypes.string,
    isProcessing : PropTypes.bool,
    isDisabled   : PropTypes.bool,
    withError    : PropTypes.bool,
    errorMessage : PropTypes.string,
    onChange     : PropTypes.func.isRequired,
    classes      : PropTypes.shape({})
};

SwitchFormField.defaultProps = {
    label        : '',
    size         : 'M',
    className    : '',
    value        : '',
    name         : '',
    isProcessing : false,
    isDisabled   : false,
    withError    : true,
    errorMessage : '',
    classes      : {}
};

export default SwitchFormField;

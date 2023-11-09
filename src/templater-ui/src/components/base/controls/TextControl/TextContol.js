import React      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import CopyTextButton from '../../CopyTextButton';

import styles     from './TextControl.less';

const cx = classnames.bind(styles);

function TextControl(props) {
    const { className, value, unit, t } = props;

    const copyControlCN = cx(styles.TextControl, {
        [className] : className
    });

    const copyText = `${value}`.concat(unit ? ` ${unit}` : '');

    return (
        <div className={copyControlCN}>
            <div className={styles.copyControlWrapper}>
                <CopyTextButton
                    // withPointer waa added to overlap cursor: default from Widget component
                    className = {cx(styles.copyButton, { withPointer: true })}
                    text = {copyText}
                    iconType = 'copyButton'
                    iconColor = 'green'
                    tooltipValue = {t('Copy')}
                    tooltipClasses = {{ tooltip: styles.tooltip }}
                    color = 'primary500'
                />
            </div>
        </div>
    );
}

TextControl.propTypes = {
    className : PropTypes.string,
    value     : PropTypes.string.isRequired,
    unit      : PropTypes.string,
    t         : PropTypes.func
};

TextControl.defaultProps = {
    className : '',
    unit      : '',
    t         : text => text
};

export default TextControl;

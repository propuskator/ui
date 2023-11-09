/* eslint-disable  no-shadow */

import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import IconButton       from './../IconButton';
import Tooltip          from './../Tooltip';

import styles         from './CopyTextButton.less';

const cx = classnames.bind(styles);


function CopyTextButton(props) { // eslint-disable-line  max-lines-per-function
    const { isDisabled, text, className, color, tooltipClasses,
        tooltipValue, iconType, iconColor, portalId, t } = props;

    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');

        textArea.value = text;

        textArea.style.opacity = 0;
        // Avoid scrolling to bottom
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';

        const container = portalId
            ? document?.getElementById(portalId) || document.body
            : document.body;

        container.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            // console.log(`Fallback: Copying text command was ${  msg}`);
            // pass
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        container.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (isDisabled) return;

        if (!navigator?.clipboard) {
            fallbackCopyTextToClipboard(text);

            return;
        }

        // eslint-disable-next-line  babel/no-unused-expressions,  more/no-then
        navigator?.clipboard?.writeText(text).then(() => {
            // pass
        }, (err) => {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function handleCopyToClipboard() {
        copyTextToClipboard(text);
    }

    const copyTextButtonCN = cx(styles.CopyTextButton, {
        [className] : className,
        disabled    : isDisabled,
        [color]     : color
    });

    return (
        <Tooltip title={t(tooltipValue)} classes={tooltipClasses} enterDelay={0}>
            <div className={copyTextButtonCN}>
                <IconButton
                    onClick    = {handleCopyToClipboard}
                    className  = {cx(styles.copyIconButton, 'abort-submit')}
                    iconType   = {iconType}
                    color      = {iconColor}
                />
            </div>
        </Tooltip>
    );
}

CopyTextButton.propTypes = {
    text           : PropTypes.any,
    isDisabled     : PropTypes.bool,
    className      : PropTypes.string,
    portalId       : PropTypes.string,
    tooltipClasses : PropTypes.shape({}),
    color          : PropTypes.oneOf([ 'primary500', 'grey' ]),
    iconType       : PropTypes.string,
    iconColor      : PropTypes.string,
    tooltipValue   : PropTypes.string,
    t              : PropTypes.func
};

CopyTextButton.defaultProps = {
    text           : '',
    isDisabled     : false,
    className      : void 0,
    tooltipClasses : void 0,
    portalId       : void 0,
    color          : 'grey',
    iconType       : 'copy',
    iconColor      : 'default',
    tooltipValue   : 'Copy text',
    t              : (text) => text
};

export default CopyTextButton;

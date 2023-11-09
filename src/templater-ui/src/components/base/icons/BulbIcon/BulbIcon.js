/* eslint-disable  react/jsx-max-props-per-line,  react/jsx-tag-spacing,  no-magic-numbers */
import React                        from 'react';
import PropTypes                    from 'prop-types';
import classnames                   from 'classnames/bind';

import styles                        from './BulbIcon.less';

const cx = classnames.bind(styles);

function BulbIcon(props) {
    const { className, isDisabled, isDark, brightness, themeMode } = props;

    const bulbIconCN = cx(styles.BulbIcon, {
        className,
        disabled              : isDisabled,
        dark                  : isDark,
        [`${themeMode}Theme`] : themeMode
    });

    // eslint-disable-next-line no-magic-numbers
    const parsedBrightness = isDark ? 1 : Math.max(Number.parseFloat(brightness), 0.01);
    const bulbColor = themeMode === 'light' && parsedBrightness < 0.2 ? '#8D9796' : 'white';

    return (
        <svg className={bulbIconCN} width='88' height='88' viewBox='0 0 88 88' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <rect
                width  = '88'
                height = '88'
                rx     = '24'
                fill   = {isDark ? '#B4BDBD' : `rgb(80, 203, 147, ${parsedBrightness})`}
            />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M44.0001 22.9165C45.0126 22.9165 45.8334 23.7373 45.8334 24.7498V27.6373C45.8334 28.6499 45.0126 29.4707 44.0001 29.4707C42.9876 29.4707 42.1667 28.6499 42.1667 27.6373V24.7498C42.1667 23.7373 42.9876 22.9165 44.0001 22.9165Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M58.9082 29.0917C59.6242 29.8076 59.6242 30.9684 58.9082 31.6844L56.8665 33.7261C56.1506 34.4421 54.9898 34.4421 54.2738 33.7261C53.5578 33.0102 53.5578 31.8494 54.2738 31.1334L56.3155 29.0917C57.0314 28.3757 58.1922 28.3757 58.9082 29.0917Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M58.5292 43.9998C58.5292 42.9873 59.3501 42.1665 60.3626 42.1665H63.2501C64.2626 42.1665 65.0834 42.9873 65.0834 43.9998C65.0834 45.0124 64.2626 45.8332 63.2501 45.8332H60.3626C59.3501 45.8332 58.5292 45.0124 58.5292 43.9998Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M54.2738 54.2735C54.9898 53.5576 56.1506 53.5576 56.8665 54.2735L58.9082 56.3152C59.6242 57.0312 59.6242 58.192 58.9082 58.908C58.1923 59.6239 57.0314 59.6239 56.3155 58.908L54.2738 56.8663C53.5578 56.1503 53.5578 54.9895 54.2738 54.2735Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M44.0001 58.529C45.0126 58.529 45.8334 59.3498 45.8334 60.3623V63.2498C45.8334 64.2624 45.0126 65.0832 44.0001 65.0832C42.9876 65.0832 42.1667 64.2624 42.1667 63.2498V60.3623C42.1667 59.3498 42.9876 58.529 44.0001 58.529Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M33.7264 54.2736C34.4423 54.9895 34.4423 56.1503 33.7264 56.8663L31.6846 58.908C30.9687 59.6239 29.8079 59.6239 29.0919 58.908C28.3759 58.192 28.376 57.0312 29.0919 56.3152L31.1337 54.2735C31.8496 53.5576 33.0104 53.5576 33.7264 54.2736Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M22.9167 43.9998C22.9167 42.9873 23.7376 42.1665 24.7501 42.1665H27.6376C28.6501 42.1665 29.4709 42.9873 29.4709 43.9998C29.4709 45.0124 28.6501 45.8332 27.6376 45.8332H24.7501C23.7376 45.8332 22.9167 45.0124 22.9167 43.9998Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M29.0919 29.0917C29.8079 28.3757 30.9687 28.3757 31.6846 29.0917L33.7264 31.1334C34.4423 31.8494 34.4423 33.0102 33.7264 33.7261C33.0104 34.4421 31.8496 34.4421 31.1336 33.7261L29.0919 31.6844C28.376 30.9684 28.376 29.8076 29.0919 29.0917Z' />
            <path fill={bulbColor} fillRule='evenodd' clipRule='evenodd' d='M31.1667 43.9998C31.1667 36.9122 36.9124 31.1665 44.0001 31.1665C51.0877 31.1665 56.8334 36.9122 56.8334 43.9998C56.8334 51.0875 51.0877 56.8332 44.0001 56.8332C36.9124 56.8332 31.1667 51.0875 31.1667 43.9998ZM44.0001 34.8332C38.9375 34.8332 34.8334 38.9372 34.8334 43.9998C34.8334 49.0624 38.9375 53.1665 44.0001 53.1665C49.0627 53.1665 53.1667 49.0624 53.1667 43.9998C53.1667 38.9372 49.0627 34.8332 44.0001 34.8332Z' />
        </svg>
    );
}

BulbIcon.propTypes = {
    className  : PropTypes.string,
    brightness : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    isDisabled : PropTypes.bool,
    isDark     : PropTypes.bool,
    themeMode  : PropTypes.string
};

BulbIcon.defaultProps = {
    className  : '',
    brightness : 1,
    isDisabled : false,
    isDark     : false,
    themeMode  : ''
};

export default BulbIcon;

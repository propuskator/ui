import React      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import styles     from './Loader.less';

const cx = classnames.bind(styles);

function Loader(props) {
    const { size, className, color } = props;
    const loaderCN = cx('loader', {
        [className] : className
    });
    const loaderWrapperCN = cx('loaderWrapper', {
        [`size${size}`] : size,
        [color]         : color
    });

    return (
        <div className = {loaderWrapperCN}>
            <div className = {loaderCN}>
                <div /><div /><div /><div /><div /><div /><div /><div />
            </div>
        </div>
    );
}

Loader.propTypes = {
    size      : PropTypes.oneOf([ 'XXS', 'XS',  'S', 'M', 'L', 'XL' ]),
    color     : PropTypes.oneOf([ 'primary', 'white', 'grey', 'red' ]),
    className : PropTypes.string
};

Loader.defaultProps = {
    size      : 'M',
    color     : 'primary',
    className : ''
};

export default Loader;

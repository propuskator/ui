import React            from 'react';
import PropTypes        from 'prop-types';
import classnames       from 'classnames/bind';

import SvgIcon          from './../../base/SvgIcon';

import styles           from './EmptyList.less';

const cx = classnames.bind(styles);

export default function EmptyList(props) {
    const { children, iconType, size } = props;

    const emptyListCN = cx(styles.EmptyList, {
        [`size${size}`] : !!size
    });

    return (
        <div className={emptyListCN}>
            <div className = {styles.iconWrapper}>
                <SvgIcon type={iconType} />
            </div>
            <div className={styles.childrenWrapper}>
                { children }
            </div>
        </div>
    );
}

EmptyList.propTypes = {
    children : PropTypes.any,
    iconType : PropTypes.string,
    size     : PropTypes.oneOf([ 'S', 'M', 'L' ])
};

EmptyList.defaultProps = {
    children : 'Ничего не найдено',
    iconType : 'emptyList',
    size     : 'L'
};

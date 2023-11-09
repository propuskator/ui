import React                        from 'react';
import PropTypes                    from 'prop-types';
import classnames                   from 'classnames/bind';

import Tooltip                          from '../../Tooltip';

import styles                           from './Led.less';

const cx = classnames.bind(styles);

function Led(props) {
    const { className, activeColor, isActive, t } = props;

    function getRingStyle() {
        if (!isActive || !activeColor) return;

        return {
            background : activeColor
        };
    }

    const ledCN = cx(styles.Led, { [className]: className });

    return (
        <Tooltip
            classes = {{ tooltip: styles.tooltip }}
            title   = {t(isActive ? 'Active' : 'Inactive')}
        >
            <div className={ledCN} >
                <div className={styles.innerRing} style={getRingStyle()} />
            </div>
        </Tooltip>
    );
}

Led.propTypes = {
    className   : PropTypes.string,
    activeColor : PropTypes.string.isRequired,
    isActive    : PropTypes.bool,
    t           : PropTypes.func
};

Led.defaultProps = {
    className : '',
    isActive  : false,
    t         : (text) => text
};

export default Led;

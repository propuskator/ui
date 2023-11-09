import React      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';
import { Link }   from 'react-router-dom';

import styles     from './Header.less';

const cx = classnames.bind(styles);

function Option(props) {
    const { icon : IconComponent, renderContent, href } = props;

    if (!IconComponent && !renderContent) return null;

    return (
        <Link
            tabIndex  = {props.disableFocus ? '-1' : '0'}
            to        = {href}
            className = {cx(styles.option, 'abort-submit')}
            onClick   =  {props.onClick}
        >
            { renderContent
                ? renderContent()
                : (
                    <>
                        <IconComponent className = {styles.optionIcon} />
                        <span className = {styles.textContainer}>
                            {props.text}
                        </span>
                    </>
                )
            }
        </Link>

    );
}

Option.propTypes = {
    onClick       : PropTypes.func,
    text          : PropTypes.string,
    icon          : PropTypes.any,
    disableFocus  : PropTypes.bool,
    renderContent : PropTypes.func,
    href          : PropTypes.string
};

Option.defaultProps = {
    text    : '',
    onClick : (e) => {
        e.preventDefault();
        e.stopPropagation();
    },
    icon          : void 0,
    renderContent : void 0,
    disableFocus  : false,
    href          : ''
};

export default Option;

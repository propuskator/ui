import React      from 'react';
import PropTypes  from 'prop-types';
import classnames from 'classnames/bind';

import styles     from './Header.less';

const cx = classnames.bind(styles);

function Option(props) {
    const { icon : IconComponent, renderContent } = props;

    if (!IconComponent && !renderContent) return null;

    return (
        <a
            tabIndex  = {props.disableFocus ? '-1' : '0'}
            href      = ''
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
        </a>

    );
}

Option.propTypes = {
    onClick       : PropTypes.func,
    text          : PropTypes.string,
    icon          : PropTypes.object,
    disableFocus  : PropTypes.bool,
    renderContent : PropTypes.func
};

Option.defaultProps = {
    text    : '',
    onClick : (e) => {
        e.preventDefault();
        e.stopPropagation();
    },
    icon          : void 0,
    renderContent : void 0,
    disableFocus  : false
};

export default Option;

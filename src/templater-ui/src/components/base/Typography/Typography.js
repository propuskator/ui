import React, { PureComponent } from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import styles                   from './Typography.less';

const cx = classnames.bind(styles);

const AVAILABLE_TAG_NAMES = [
    'li',
    'div',
    'h1'
];

class Typography extends PureComponent {
    static propTypes = {
        align   : PropTypes.string,
        variant : PropTypes.oneOf([
            'headline1',
            'headline2',
            'headline3',
            'headline4',
            'body1',
            'body2',
            'caption1',
            'caption2',
            ''
        ]).isRequired,
        className : PropTypes.string,
        color     : PropTypes.oneOf([
            'white',
            'black',
            'tipColor',
            'greyDark',
            'primary900',
            'primary600',
            ''
        ]),
        tagName  : PropTypes.string,
        children : PropTypes.any
    };

    static defaultProps = {
        align     : 'left',
        tagName   : 'div',
        color     : '',
        className : '',
        children  : ''
    };

    render() {
        const {
            align,
            variant,
            children,
            className,
            color,
            tagName
        } = this.props;

        const TypographyCN = cx(styles.Typography, {
            [className] : className,
            [variant]   : variant,
            [color]     : color,
            align
        });
        const Component = tagName && AVAILABLE_TAG_NAMES.includes(tagName) ? tagName : 'div';

        return (
            <Component
                className = {TypographyCN}
                align     = {align}
                variant   = {variant}
            >
                { children }
            </Component>
        );
    }
}

export default Typography;

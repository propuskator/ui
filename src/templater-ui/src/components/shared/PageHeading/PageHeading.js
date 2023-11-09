import React, {
    useCallback,
    memo
}                               from 'react';
import PropTypes                from 'prop-types';
import classnames               from 'classnames/bind';

import { useMedia }             from './../../../utils/mediaQuery';
import Typography               from './../../base/Typography';
import Button                   from './../../base/Button';
import IconButton               from './../../base/IconButton';

import styles                   from './PageHeading.less';

const cx = classnames.bind(styles);

function PageHeading(props) {
    const {
        className,
        title,
        buttonTitle,
        buttonProps,
        onButtonClick,
        withMobileBtn
    } = props;
    const isMobile = useMedia(
        // Media queries
        [ '(max-width: 612px)', '(min-width: 613px)' ],
        // values by media index
        [ true, false ],
        // Default
        false
    );

    const pageHeadingCN = cx(styles.PageHeading, {
        [className] : className,
        mobile      : isMobile
    });

    const handleButtonClick = useCallback(() => {
        if (onButtonClick) onButtonClick();
    }, []);

    return (
        <div className = {pageHeadingCN}>
            <Typography
                variant   = 'headline2'
                color     = 'primary900'
                className = {styles.title}
            >
                { title }
            </Typography>
            { withMobileBtn && isMobile
                ? (
                    <IconButton
                        {...(buttonProps || {})}
                        className = {cx(styles.createMobileButton, {
                            [buttonProps?.className] : buttonProps?.className
                        })}
                        onClick   = {handleButtonClick}
                        iconType  = 'plusButton'
                    />
                ) : (
                    <Button
                        color     = 'actionButton'
                        onClick   = {handleButtonClick}
                        size      = {isMobile ? 'M' : 'L'}
                        {...(buttonProps || {})}
                        className = {cx(styles.createButton, { [buttonProps?.className]: buttonProps?.className })}
                    >
                        { buttonTitle }
                    </Button>
                )
            }
        </div>
    );
}

PageHeading.propTypes = {
    className     : PropTypes.string,
    title         : PropTypes.any.isRequired,
    buttonTitle   : PropTypes.string.isRequired,
    buttonProps   : PropTypes.shape({}),
    onButtonClick : PropTypes.func,
    withMobileBtn : PropTypes.bool
};

PageHeading.defaultProps = {
    className     : '',
    onButtonClick : void 0,
    buttonProps   : {},
    withMobileBtn : true
};


export default memo(PageHeading);

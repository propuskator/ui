import React, {
    useCallback,
    memo
}                               from 'react';
import PropTypes                from 'prop-types';
import { connect }              from 'react-redux';
import classnames               from 'classnames/bind';

import { useMedia }             from 'templater-ui/src/utils/mediaQuery';
import Button                   from 'templater-ui/src/components/base/Button';
import Typography               from 'templater-ui/src/components/base/Typography';
import IconButton               from 'templater-ui/src/components/base/IconButton';

import { openModal }            from 'Actions/view';

import styles                   from './PageHeading.less';

const cx = classnames.bind(styles);

function PageHeading(props) {
    const {
        className,
        title,
        buttonTitle,
        onButtonClick,
        renderCustomControls
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

    const renderDefaultButtons = useCallback(() => {
        return isMobile
            ? (
                <IconButton
                    className = {styles.createMobileButton}
                    onClick   = {handleButtonClick}
                    iconType  = 'plusButton'
                />
            ) : (
                <Button
                    color     = 'actionButton'
                    onClick   = {handleButtonClick}
                    className = {styles.createButton}
                    size      = 'L'
                >
                    { buttonTitle }
                </Button>
            );
    }, [ isMobile, buttonTitle, handleButtonClick ]);

    return (
        <div className = {pageHeadingCN}>
            <Typography
                variant   = 'headline2'
                color     = 'primary900'
                className = {styles.title}
            >
                { title }
            </Typography>

            <div className={styles.buttons}>
                {
                    renderCustomControls
                        ? renderCustomControls({ isMobile })
                        : renderDefaultButtons()
                }
            </div>
        </div>
    );
}

PageHeading.propTypes = {
    className            : PropTypes.string,
    title                : PropTypes.string.isRequired,
    buttonTitle          : PropTypes.string.isRequired,
    onButtonClick        : PropTypes.func,
    renderCustomControls : PropTypes.func
};

PageHeading.defaultProps = {
    className            : '',
    onButtonClick        : void 0,
    renderCustomControls : void 0
};

const mapDispatchToProps = {
    openModal
};

export default memo(connect(null, mapDispatchToProps)(PageHeading));

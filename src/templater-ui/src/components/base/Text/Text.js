import React, {
    useState,
    useEffect,
    useRef,
    memo
}                        from 'react';
import PropTypes         from 'prop-types';
import classnames        from 'classnames/bind';
import useResizeObserver from 'use-resize-observer/polyfilled';

import debounce          from './../../../utils/helpers/debounce';
import Tooltip           from './../Tooltip';

import styles            from './Text.less';

const cx = classnames.bind(styles);

function Text(props) {
    const {
        className,
        ariaLabel,
        text,
        tooltipText,
        tooltipMode
    } = props;
    const { ref }                     = useResizeObserver({
        onResize : debounce(checkIsOverflow, 500, false)    // eslint-disable-line no-magic-numbers
    });
    const invisibleBlockRef           = useRef({});
    const [ isTooLong, setIsTooLong ] = useState();
    const isInitialized = ([ true, false ].includes(isTooLong));

    const isTooltipShown = isTooLong || tooltipMode === 'always';

    useEffect(() => {
        checkIsOverflow();
    }, [ text ]);

    function checkIsOverflow() {
        const { scrollWidth, offsetWidth } = invisibleBlockRef?.current || {};

        if (!scrollWidth || !offsetWidth) return;

        const blockWidth = offsetWidth !== 0 ? `${offsetWidth}px` : '100%';

        setIsTooLong(scrollWidth > offsetWidth);

        if (!ref.current.children[1]) return;
        if (ref.current.children[1].style.width !== blockWidth) {
            ref.current.children[1].style.width = blockWidth;
        }
    }

    const textWrapperCN = cx(styles.textWrapper, {
        [className] : className
    });
    const textCN = cx(styles.Text, {
        notInitialized : !isInitialized,
        tooLong        : isTooltipShown
    });

    return (
        <div className={textWrapperCN} ref={ref}>
            <div
                className = {styles.invisibleBlock}
                ref       = {node => invisibleBlockRef.current = node}
            >
                { text}
            </div>
            { isTooltipShown && isInitialized
                ? (
                    <Tooltip
                        title     = {tooltipText || text}
                        ariaLabel = {ariaLabel}
                        placement = 'bottom'
                    >
                        <div className={textCN}>
                            {text}
                        </div>
                    </Tooltip>
                ) : null
            }
            { !isTooltipShown
                ? (
                    <div className={textCN}>
                        { text }
                    </div>
                ) : null
            }
        </div>
    );
}

Text.propTypes = {
    text        : PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    tooltipText : PropTypes.string,
    tooltipMode : PropTypes.oneOf([ 'always', 'overflow' ]),
    className   : PropTypes.string,
    ariaLabel   : PropTypes.string
};

Text.defaultProps = {
    text        : '',
    tooltipText : '',
    tooltipMode : 'overflow',
    className   : '',
    ariaLabel   : void 0
};

export default memo(Text);

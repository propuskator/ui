/* eslint-disable react/no-unused-prop-types */

import React, {
    useRef,
    useEffect,
    useState
}                        from 'react';
import PropTypes         from 'prop-types';
import classnames        from 'classnames/bind';
import useResizeObserver from 'use-resize-observer/polyfilled';
import ClearIcon         from '@material-ui/icons/Clear';
import IconButton        from '@material-ui/core/IconButton';

import debounce          from '../../../utils/helpers/debounce';
import Tooltip           from '../Tooltip';

import styles            from './Chip.less';

const cx = classnames.bind(styles);


function Chip(props) {  // eslint-disable-line max-lines-per-function
    const { children, tooltipMode, tooltipContent, isArchived, t } = props;
    const processTooltipMode = isArchived ? 'always' : tooltipMode;

    const [ showTooltip, setShowTooltip ] = useState(processTooltipMode === 'always');
    const chipLabelRef        = useRef({});
    const invisibleBlockRef   = useRef({});
    const { ref }  = useResizeObserver({
        onResize : debounce(checkIsOverflow, 500, false)    // eslint-disable-line no-magic-numbers
    });

    useEffect(() => {
        checkIsOverflow();
    }, [ children ]);

    useEffect(() => {
        if (processTooltipMode === 'always' && !showTooltip) setShowTooltip(true);
        else if (processTooltipMode === 'never' && showTooltip) setShowTooltip(false);
    }, [ processTooltipMode ]);

    function checkIsOverflow() {
        if ([ 'always', 'never' ].includes(processTooltipMode)) return;

        if (!invisibleBlockRef?.current) return;
        const labelWidth = chipLabelRef.current?.clientWidth || 0;
        const realWidth = invisibleBlockRef?.current?.scrollWidth || 0;
        const isOverflow = realWidth > labelWidth;  // eslint-disable-line no-magic-numbers

        if (isOverflow) setShowTooltip(true);
        else setShowTooltip(false);
    }

    function handleDelete() {
        const { onDelete, id, disabled } = props;

        if (onDelete && !disabled) onDelete(id);
    }

    function handleClick() {
        const { onClick, disabled } = props;

        if (onClick && !disabled) onClick();
    }

    function renderComponent() {
        const {
            classes,
            onDelete,
            disabled,
            onClick,
            size,
            background,
            // color,
            tagName,
            className,
            variant,
            style
        } = props;

        const isButton = [ 'button' ].includes(tagName);

        const processBackground = background;

        const chipCN = cx(styles.Chip, classes.chipRoot, {
            disabled,
            hoverable         : !!onClick && !disabled,
            [`size${size}`]   : size,
            // [color]        : color,
            [tagName]         : tagName,
            [className]       : className,
            [variant]         : isArchived ? void 0 : !!variant,
            'button'          : isButton,
            withBackground    : !!background,
            withoutBackground : !background,
            archived          : isArchived
        });

        const chipStyle = {
            ...(processBackground ? { background: processBackground } : {}),
            ...style
        };

        const Component = [ 'button' ].includes(tagName) ? tagName : 'div';

        return (
            <Component
                className = {chipCN}
                style     = {chipStyle}
                onClick   = {handleClick}
                ref       = {node => ref.current = node?.parentNode || node}
            >
                <div
                    className = {cx(styles.label, classes.chipLabel)}
                    ref       = {node => chipLabelRef.current = node}
                >
                    { children }
                    { ![ 'always', 'never' ].includes(processTooltipMode)
                        ? (
                            <div className={styles.invisibleBlock} ref={node => invisibleBlockRef.current = node}>
                                { children }
                            </div>
                        ) : null
                    }
                </div>
                { onDelete
                    ? (
                        <IconButton
                            disableRipple      = {disabled}
                            onClick            = {handleDelete}
                            className          = {cx(styles.deleteButton, 'abort-submit')}
                        >
                            <ClearIcon fontSize='small' />
                        </IconButton>
                    ) : null
                }
            </Component>
        );
    }

    const tooltipData = (
        <div>
            { props?.isArchived
                ? <div>❌ {t('HIDE')} </div>
                : null
            }
            {tooltipContent || children}
        </div>
    );

    return showTooltip
        ? (
            <Tooltip title={tooltipData}>
                { renderComponent() }
            </Tooltip>
        ) : renderComponent();
}

Chip.propTypes = {
    id             : PropTypes.any,
    isArchived     : PropTypes.bool,
    children       : PropTypes.any,
    tooltipContent : PropTypes.any,
    onDelete       : PropTypes.func,
    classes        : PropTypes.shape({
        chipRoot  : PropTypes.string,
        chipLabel : PropTypes.string
    }),
    disabled : PropTypes.bool,
    onClick  : PropTypes.func,
    size     : PropTypes.oneOf([
        'S', 'M', 'L', 'XL', 'XXL'
    ]),
    tooltipMode : PropTypes.oneOf([
        'onOverflow',
        'always',
        'never'
    ]),
    color   : PropTypes.string,
    t       : PropTypes.func,
    // color : PropTypes.oneOf([
    //     'white',
    //     'blue',
    //     'yellow',
    //     'red',
    //     'green',
    //     'grey',
    //     'mediumGrey',
    //     'pink',
    //     'accessSchedule'
    //     ''
    // ]),
    tagName : PropTypes.oneOf([
        'button',
        ''
    ]),
    background : PropTypes.string,
    className  : PropTypes.string,
    variant    : PropTypes.oneOf([
        'outlined',
        'filled',
        ''
    ]),
    style : PropTypes.object
};

Chip.defaultProps = {
    id             : '',
    tooltipMode    : 'onOverflow',
    tooltipContent : '',
    classes        : { },
    onDelete       : void 0,
    children       : null,
    disabled       : false,
    isArchived     : false,
    onClick        : void 0,
    t              : (text) => text,
    className      : '',
    size           : 'M',
    color          : '',
    tagName        : '',
    background     : '',
    variant        : '',
    style          : {}
};

export default React.memo(Chip);

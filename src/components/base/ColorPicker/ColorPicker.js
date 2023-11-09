import React, {
    useState,
    useRef,
    useEffect,
    memo
}                     from 'react';
import PropTypes      from 'prop-types';
import classnames     from 'classnames/bind';
import { makeStyles } from '@material-ui/core/styles';
import Popover        from '@material-ui/core/Popover';

import Typography     from 'templater-ui/src/components/base/Typography';
import ErrorMessage   from 'templater-ui/src/components/base/ErrorMessage';
import Loader         from 'templater-ui/src/components/base/Loader';

// import { generateUniqueRandomNumbersBetween } from 'Utils/random';

import ColorCell      from './ColorCell';
import palette        from './palette.json';
import styles         from './ColorPicker.less';

const cx = classnames.bind(styles);
const useStyles = makeStyles({
    paper : {
        maxWidth : 'unset'
    }
});

function ColorPicker(props) {  /* eslint-disable-line max-lines-per-function */
    const {
        name,
        value : selectedColorCell,
        default : _default,
        label,
        preSelectedColors,
        errorMessage,
        onChange,
        withError,
        isFetching,
        className,
        t
    } = props;

    const anchorElRef = useRef();
    const [ anchorEl, setAnchorEl ] = React.useState(null);
    const [ defaultColors, setDefaultColors ] = useState(generateDefaultColors(_default));

    useEffect(() => {
        if (selectedColorCell && !defaultColors.includes(selectedColorCell)) {
            setDefaultColors([ selectedColorCell, ...defaultColors.slice(1) ]);
        }
        if (!selectedColorCell) handleColorCellCkicked(defaultColors[0]);
    }, [ selectedColorCell ]);

    const mql = window.matchMedia('(min-width: 551px)');
    const viewMode = mql.matches ? 'desktop' : 'mobile';

    function handleColorCellCkicked(colorCellValue) {
        onChange({ name, value: colorCellValue });
        closePalette();
    }

    // eslint-disable-next-line react/no-multi-comp
    function renderColorCell(colorValue, options = {}) {
        const { withAutoFocus, isFirstCell, ...restOptions } = options;
        const isSelected     = selectedColorCell === colorValue;
        const isPrevSelected = preSelectedColors.includes(colorValue);
        const isAutoFocus    = selectedColorCell ? isSelected : isFirstCell;

        return (
            <ColorCell
                key            = {colorValue}
                autoFocus      = {withAutoFocus ? isAutoFocus : false}
                color          = {colorValue}
                isSelected     = {isSelected}
                isPrevSelected = {isPrevSelected}
                onClick        = {handleColorCellCkicked}
                {...restOptions}
            />
        );
    }

    function renderColorCellSmall(colorValue, options = {}) {
        return renderColorCell(colorValue, { ...options, size: 'S', hoverStyle: 'border' });
    }
    function renderColorCellMiddle(colorValue, options = {}) {
        return renderColorCell(colorValue, { ...options, size: 'M', hoverStyle: 'shadow' });
    }
    function openPalette(e) {
        e.preventDefault();
        setAnchorEl(anchorElRef.current);
    }
    function closePalette() {
        setAnchorEl(null);
    }

    const classes = useStyles();
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const colorPickerCN = cx(styles.ColorPicker, {
        [className] : className
    });
    const colorPaletteCN = cx(styles.colorPalette, {});

    return (
        <div className={colorPickerCN}>
            <Typography
                variant   = 'caption1'
                color     = 'black'
                className = {styles.title}
            >
                {label}
            </Typography>
            <div
                ref       = {node => anchorElRef.current = node}
                className = {styles.defaultColorsContainer}
            >
                {defaultColors.map(renderColorCellMiddle)}
                <button
                    tabIndex  = '0'
                    type      = 'button'
                    className = {`${styles.moreButton} abort-submit`}
                    onClick   = {openPalette}
                >
                    {t('More')}
                </button>
            </div>
            <Popover
                id              = {id}
                open            = {open}
                anchorEl        = {anchorEl}
                onClose         = {closePalette}
                anchorOrigin    = {{ vertical: 'bottom', horizontal: viewMode === 'mobile' ? 'center' : 'left' }}
                transformOrigin = {{ vertical: 'top', horizontal: viewMode === 'mobile' ? 'center' : 'left' }}
                marginThreshold = {0}
                classes         = {classes}
            >
                <div className={colorPaletteCN}>
                    {palette.map((colorGroup, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={i}>
                            {colorGroup.map((color, colorIndex) => (
                                renderColorCellSmall(color, {
                                    withAutoFocus : true,
                                    isFirstCell   : i === 0 && colorIndex === 0
                                })
                            ))}
                        </div>
                    ))}
                    {isFetching
                        ? (
                            <div className={styles.colorPaletteLoader}>
                                <div className={styles.loaderWrapper}>
                                    <Loader size='S' />
                                </div>
                            </div>
                        ) : null}
                </div>
            </Popover>
            {withError ? <ErrorMessage error={errorMessage} /> : null}
        </div>
    );
}

ColorPicker.propTypes = {
    name              : PropTypes.string.isRequired,
    value             : PropTypes.string,
    label             : PropTypes.string,
    default           : PropTypes.string,
    preSelectedColors : PropTypes.arrayOf(PropTypes.string),
    errorMessage      : PropTypes.string,
    onChange          : PropTypes.func,
    withError         : PropTypes.bool,
    isFetching        : PropTypes.bool,
    className         : PropTypes.string,
    t                 : PropTypes.func.isRequired
};

ColorPicker.defaultProps = {
    value             : '',
    label             : 'Цвет',
    default           : null,
    preSelectedColors : [],
    errorMessage      : '',
    onChange          : () => {},
    withError         : true,
    isFetching        : false,
    className         : ''
};

export default memo(ColorPicker);


function generateDefaultColors(_default) {
    const defaultColors = palette.reduce((accum, curr) => ([ ...accum, ...curr ]), []);

    if (defaultColors.length === 0) return [];
    /* eslint-disable-next-line no-magic-numbers */
    // const indexes = generateUniqueRandomNumbersBetween(0, defaultColors.length - 1, 5);
    // const colors = indexes.map(indx => defaultColors[indx]);

    // const colors = [ '#6FA8FF', '#83E4E4', '#BA86FF', '#FF7373', '#FF9B3F' ];
    const colors = [ '#3F80E3', '#2CB9B9', '#AF73FD', '#F86060', '#FF9B3F' ];

    const defaultIndx = colors.indexOf(_default);

    if (defaultIndx > 0) {
        [ colors[0], colors[defaultIndx] ] = [ colors[defaultIndx], colors[0] ];
    }

    return colors;
}

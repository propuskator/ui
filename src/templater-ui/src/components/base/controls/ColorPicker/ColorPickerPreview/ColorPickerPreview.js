import React, { useMemo }            from 'react';
import PropTypes                     from 'prop-types';
import classnames                    from 'classnames/bind';

import Tooltip                       from '../../../Tooltip';

import { formatColor, convertColor } from '../../../../../utils/color';
import { EMPTY_TEXT }                from '../../../../../constants/index';

import styles                        from './ColorPickerPreview.less';

const cx = classnames.bind(styles);

function ColorPickerPreview(props) {
    const {
        type,
        value,
        isProcessing
    } = props;

    const backgroundColor = useMemo(() => {
        if (type && value) {
            try {
                const convertedColor = convertColor(type, value);

                return `rgb(${formatColor('rgb', convertedColor)})`;
            } catch (e) {
                return '';
            }
        }
    }, [ type, value ]);

    const colorPickerPreviewCN = cx(styles.ColorPickerPreview, {
        processing : isProcessing
    });

    const tooltipCN = cx('tooltip');
    const previewStyles = backgroundColor ? {} : {  pointerEvents: 'none', userSelect: 'none' };

    return (
        <div className={colorPickerPreviewCN}>
            <Tooltip
                title       = {value}
                classes     = {{
                    tooltip : tooltipCN
                }}
                isDisabled = {!backgroundColor}
            >
                <div
                    className = {cx(styles.colorPreview, { invalid: !backgroundColor })}
                    style     = {{ backgroundColor, ...previewStyles }}
                >
                    { backgroundColor ? undefined : EMPTY_TEXT }
                </div>
            </Tooltip>
        </div>
    );
}

ColorPickerPreview.propTypes = {
    value        : PropTypes.string,
    type         : PropTypes.oneOf([ 'rgb', 'hsv', 'hex' ]),
    isProcessing : PropTypes.bool
};

ColorPickerPreview.defaultProps = {
    isProcessing : false,
    value        : '',
    type         : void 0
};

export default ColorPickerPreview;

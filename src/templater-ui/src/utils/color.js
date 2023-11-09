/* eslint-disable  no-magic-numbers */
import convert from 'color-convert';

/**
 * Parse given raw color string value by type and convert into the color object
 * @param type {string} - color format; supported formats: 'rgb', 'hsv', 'hex'
 * @param value {string|Array<string>} - raw color value in Homie format: "127,90,50"
 * @param separator {string?} - raw value separator
 * @return {{hsv: {h: number, s: number, v: number}, rgb: {r: number, b: number, g: number}, hex: string}}
 */
export function convertColor(type, value = '', separator = ',') {
    let parsedValue;

    if (Array.isArray(value)) {
        parsedValue = value;
    } else {
        switch (type) {
            case 'rgb':
                parsedValue = `${value}`.split(separator).map(item => parseInt(item, 10));
                break;
            case 'hsv':
                parsedValue = `${value}`.split(separator).map(item => parseInt(item, 10));
                break;
            case 'hex':
                parsedValue = value.replace(/^#?[^a-f0-9]/ig, '');
                break;
            default:
                return;
        }
    }

    if (type !== 'hex' && parsedValue.length < 3) return;

    const converter = convert[type];
    const rgbArr = type === 'rgb' ? parsedValue : converter.rgb(parsedValue);
    const hsvArr = type === 'hsv' ? parsedValue : converter.hsv(parsedValue);
    const hex    = type === 'hex' ? value : `#${converter.hex(parsedValue)}`;

    return {
        rgb : {
            r : rgbArr[0],
            g : rgbArr[1],
            b : rgbArr[2]
        },
        hsv : {
            h : hsvArr[0],
            s : hsvArr[1] / 100,
            v : hsvArr[2] / 100
        },
        hex : hex.toUpperCase()
    };
}

/**
 * Format color object into a raw string value
 * @param type {string} - color format; supported formats: 'rgb', 'hsv', 'hex'
 * @param color {{hsv: {h: number, s: number, v: number}, rgb: {r: number, b: number, g: number}, hex: string}}
 * @param separator {string?} - raw value separator
 * @return {string}
 */
export function formatColor(type, color, separator = ',') {
    switch (type) {
        case 'rgb':
            return [ color.rgb.r, color.rgb.g, color.rgb.b ]
                .join(separator);
        case 'hsv':
            return [ color.hsv.h, color.hsv.s * 100, color.hsv.v * 100 ]
                .map(value => Math.round(value))
                .join(separator);
        case 'hex':
            return color.hex;
        default:
            return;
    }
}

export function convertHvsToCss() {
}

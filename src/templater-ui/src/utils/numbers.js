/* eslint-disable  no-magic-numbers */
export function getDecimalPart(value) {
    return value.toString().split('.')[1];
}

export function getDecimalPartLength(value) {
    const decimalPart = getDecimalPart(value);

    return decimalPart && decimalPart.length ? decimalPart.length : 0;
}

export function gracefulDecrement(value, step = 1) {
    const stringValue = value.toString();
    const stepDecimalPartLength = getDecimalPartLength(step);
    const valueDecimalPartLength = getDecimalPartLength(value);
    const decimalPartLength = valueDecimalPartLength > stepDecimalPartLength ?
        valueDecimalPartLength :
        stepDecimalPartLength;
    const multiplier = 10 ** decimalPartLength;

    return Math.round((parseFloat(stringValue) - step) * multiplier) / multiplier;
}

export function gracefulIncrement(value, step = 1) {
    const stringValue = value.toString();
    const stepDecimalPartLength = getDecimalPartLength(step);
    const valueDecimalPartLength = getDecimalPartLength(value);
    const decimalPartLength = valueDecimalPartLength > stepDecimalPartLength ?
        valueDecimalPartLength :
        stepDecimalPartLength;
    const multiplier = 10 ** decimalPartLength;

    return Math.round((parseFloat(stringValue) + step) * multiplier) / multiplier;
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

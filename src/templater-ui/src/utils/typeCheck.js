export function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

export function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}

export function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

import * as queryString from 'query-string';

const CONFIG = { arrayFormat: 'bracket' };

export function stringify(params) {
    return queryString.stringify(params, CONFIG);
}

export function parse(str) {
    return queryString.parse(str, CONFIG);
}

export default {
    parse,
    stringify
};


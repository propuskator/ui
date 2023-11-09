import X from './Base.js';

export const FETCH_ERROR = class FetchError extends X {
    constructor() {
        super({
            code    : 'FETCH_ERROR',
            message : 'Failed to fetch'
        });
    }
};

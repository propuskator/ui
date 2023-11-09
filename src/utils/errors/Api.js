import X from './Base.js';

export const FETCH_ERROR = class FetchError extends X {
    constructor() {
        super({
            code    : 'FETCH_ERROR',
            message : 'Failed to fetch'
        });
    }
};

export function apiErrorsHandler(error) {
    const { errors, type } = error || {};
    const errorsData = {
        isServer    : true,
        type,
        serverError : '',
        code        : ''
    };

    if (errors && errors?.length && type === 'validation') {
        errorsData.errors = {};

        errors.forEach(item => {
            if (!item?.field || !item?.message) return;

            errorsData.errors[item?.field] = item.message;
        });
    } else {
        errorsData.serverError = error.message;
        errorsData.code = error.code;
    }

    return errorsData;
}

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function capitalizeString(str) {
    if (!str) return str;
    if (typeof str !== 'string') return str;

    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

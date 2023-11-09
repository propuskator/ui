export function checkIsSlowConnection() {
    const connection = navigator?.connection || navigator?.mozConnection || navigator?.webkitConnection;

    if (!connection) return false;

    if ([ 'slow-2g' ].includes(connection?.effectiveType)) return true;

    return false;
}

export function deepClone(data) {
    if (!data) return data;

    try {
        return JSON.parse(JSON.stringify(data));
    } catch (error) {
        console.error(error);

        return void 0;
    }
}

export function leftTrim(str) {
    if (!str) return str;

    return str.replace(/^\s+/g, '');
}

export function filterZeroWidthCharacters(str, isMultiline) {
    if (!str) return str;

    return isMultiline
        ? str.replace(/[\u200B\u0085]/g, '')
        : str.replace(/[^\S ]+|[\u200B\u0085]/g, '');
}

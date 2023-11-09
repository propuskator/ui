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

// eslint-disable-next-line func-names
const localStorageMock = (function () {
    let store = {};

    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
        clear() {
            store = {};
        },
        getStore() {
            return store;
        }
    };
}());

export default localStorageMock;

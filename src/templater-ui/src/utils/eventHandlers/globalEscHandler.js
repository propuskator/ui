/**
 * Global ESC handling helper
 * while ESC keydown event fired, calls latest registered handler function
 * event is captured on the capturing phase, further capturing prevented
 */
class GlobalEscHandler {
    constructor() {
        document.addEventListener('keydown', this._eventHandler, true);

        this._stack = [];
    }

    register(handler) {
        this._stack.push(handler);
    }

    unregister(handler) {
        this._stack = this._stack.filter(item => item !== handler);
    }

    _eventHandler = e => {
        const { key } = e;

        if (key === 'Escape') {
            const handler = this._stack[this._stack.length - 1];

            if (handler) {
                e.stopPropagation();

                handler(e);
            }
        }
    }
}

const globalEscHandler = new GlobalEscHandler();

export default globalEscHandler;

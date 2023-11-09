/* eslint-disable babel/no-unused-expressions */
/**
 * Global ENTER handling helper
 * while ENTER keydown event fired, calls latest registered handler function
 * event is captured on the capturing phase, further capturing prevented
 */
class GlobalEnterHandler {
    constructor() {
        document.addEventListener('keydown', this._eventHandler, true);

        this._stack = [];
    }

    register(handler, options) {
        this._stack.push({ handler, options });
    }

    unregister(handler) {
        this._stack = this._stack.filter(item => item?.handler !== handler);
    }

    _eventHandler = e => {
        const { key, target } = e;
        const EDITOR_CN = 'ace_text-input';

        if (target?.classList?.contains(EDITOR_CN)) return;

        if (key !== 'Enter') return;
        if ([ 'BUTTON', 'A' ].includes(target.nodeName)) {
            if (target?.classList?.contains('abort-submit')) return;
        }
        if (target?.id === 'select--opened') return;

        const handlersToTrigger = this._stack.filter((handlerData, index) => {
            return !!handlerData?.options?.alwaysTrigger || index === this._stack.length - 1;
        });
        const skipPrevent = !!handlersToTrigger?.find(handlerData => handlerData?.options?.skipPrevent);

        if (skipPrevent) {
            if (e) e.stopPropagation();
            if (e) e.preventDefault();
        }

        handlersToTrigger?.forEach(({ handler } = {}) => {
            if (handler) handler(e);
        });
    }
}

const globalEnterHandler = new GlobalEnterHandler();

export default globalEnterHandler;

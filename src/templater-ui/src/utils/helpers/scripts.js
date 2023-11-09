export function loadScript({
    domElem, tag = 'script', id,
    src, async = true
}) {
    return new Promise((resolve, reject) => {
        const firstScript = domElem.getElementsByTagName(tag)[0];
        const js = domElem.createElement(tag);

        js.onerror = reject;
        js.onload = resolve;

        js.id = id;
        js.src = src;
        js.async = async;

        if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(js, firstScript);
        } else {
            domElem.head.appendChild(js);
        }
    });
}

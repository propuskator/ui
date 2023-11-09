export default function debounce(func, wait, immediate = false) {
    let timeout;

    return function executedFunction() {
        const context = this;
        const args = arguments;

        function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }

        const callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

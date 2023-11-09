export default function checkCookie() {
    let cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled) {
        document.cookie = 'testcookie';
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1;    /* eslint-disable-line no-magic-numbers */
    }

    return cookieEnabled;
}

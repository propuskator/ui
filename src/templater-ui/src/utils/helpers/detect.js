/* eslint-disable  no-magic-numbers */
export function checkIsMobile() {
    const MOBILE_MAX_WIDTH_THRESHOLD = 769;

    return window.innerWidth < MOBILE_MAX_WIDTH_THRESHOLD;
}

export function checkIsTablet() {
    const TABLET_MAX_WIDTH_THRESHOLD = 950;

    return window.innerWidth <= TABLET_MAX_WIDTH_THRESHOLD;
}

export function checkIsIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function checkIsSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function checkIsTouchDevice() {
    return 'ontouchstart' in window;
}

export function getOperatingSystem() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms   = [ 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K' ];
    const windowsPlatforms = [ 'Win32', 'Win64', 'Windows', 'WinCE' ];
    const iosPlatforms     = [ 'iPhone', 'iPad', 'iPod' ];

    let os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

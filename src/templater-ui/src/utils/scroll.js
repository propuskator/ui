import {
    disableBodyScroll,
    clearAllBodyScrollLocks
} from 'body-scroll-lock';

import {
    checkIsIOS,
    checkIsSafari
} from './helpers/detect';

const IS_IOS = checkIsIOS();
const IS_SAFARI = checkIsSafari();
const IS_SCROLL_ISSUES = IS_IOS || IS_SAFARI;

export function checkIsScrollIssue() {
    return IS_SCROLL_ISSUES;
}

export function toggleScrollContent({ disableScroll = false } = {}) {
    if (!IS_SCROLL_ISSUES) return;

    const elements = [ ...(document.getElementsByClassName('scroll-content') || []) ];

    if (!elements.length) return;

    elements.forEach((element) => {
        if (disableScroll) {
            element.style.overflow = 'hidden';
        } else {
            element.style.overflow = 'auto';    /* eslint-disable-line more/no-duplicated-chains */
        }
    });

    // Doesn't work
    // if (disableScroll) {
    //     // document.body.addEventListener('touchstart', this.preventDefault, { passive: false });
    //     document.body.addEventListener('touchmove', this.preventDefault, { passive: false });
    // } else {
    //     // document.body.removeEventListener('touchstart', this.preventDefault, { passive: false });
    //     document.body.removeEventListener('touchmove', this.preventDefault, { passive: false });
    // }
}

export function fixScrollIssueMobSafari({ isDisableScroll = false, elemNode }) {
    if (checkIsIOS()) {
        if (isDisableScroll) {
            disableBodyScroll(elemNode);
        } else {
            clearAllBodyScrollLocks();
        }
    }
}

import actions from './moduleActions';

const { toasts } = actions;

export const addToast         = toasts.addToast;
export const removeToast      = toasts.removeToast;
export const removeToastByKey = toasts.removeToastByKey;

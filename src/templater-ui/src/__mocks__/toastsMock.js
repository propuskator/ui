import { TOASTS_KEYS } from '../constants/toasts';

export const TOAST_ERROR_MOCK = {
    type                 : 'error',
    key                  : TOASTS_KEYS.brokerConnectionLost,
    title                : 'Error',
    message              : 'Broker connection lost',
    hideByTimeout        : true,
    withCloseAbility     : false,
    id                   : 'testid',
    preventDuplicate     : true,
    showOnSessionDestroy : false,
    timeout              : undefined
};

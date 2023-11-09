export function getDefaultConfiguration({ values, handleChangeLanguage, lang, t }) {
    return {
        name   : 'mainInfo',
        fields : [
            {
                name  : 'email',
                type  : 'copyText',
                title : 'Email',
                text  : values?.login
            }, {
                name  : 'vendor_id',
                type  : 'copyText',
                title : t('Vendor ID'),
                text  : values?.id
            }, {
                name    : 'lang',
                type    : 'dropdown',
                label   : t('Language'),
                default : '',
                props   : {
                    options : [ {
                        label : t('English'),
                        value : 'en'
                    }, {
                        label : t('Russian'),
                        value : 'ru'
                    } ],
                    onChange     : handleChangeLanguage,
                    value        : lang,
                    withClear    : false,
                    withKeyboard : false
                }
            }
        ]
    };
}

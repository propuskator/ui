import * as TYPE_CHECKER from './typeCheck';

export function getFormData(data, keysList) {
    const formData = new FormData();

    keysList.forEach(keyData => {
        const { key, asKey } = keyData;
        const fieldData = data[key];
        const isArray   = TYPE_CHECKER.isArray(fieldData);

        if (isArray) {
            const isEmpty = !fieldData?.length;

            if (isEmpty) {
                formData.append(`${asKey}[]`, []);
            } else {
                fieldData.forEach(arrayItem => {
                    formData.append(`${asKey}[]`, arrayItem);
                });
            }
        } else if ([ false, '' ].includes(fieldData) || fieldData) {
            formData.append(asKey, fieldData);
        }
    });

    return formData;
}

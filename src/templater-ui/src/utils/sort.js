/* eslint-disable no-magic-numbers, more/no-numeric-endings-for-variables, eol-last */
export function sortComparator(aField, bField, order = 'ASC') {    // order = [ 'ASC', 'DESC' ]
    const length = aField.length < bField.length ? aField.length : bField.length;

    for (const index in new Array(length).fill(null)) { // eslint-disable-line guard-for-in,  no-unused-vars
        if (!aField[index]) return positivCompare(order);
        if (!bField[index]) return negativCompare(order);

        let aChar = aField[index].charCodeAt();
        let bChar = bField[index].charCodeAt();

        const charFor0 = 48;
        const charFor9 = 57;
        // 75?
        const charForA = 41;


        if (aChar >= charFor0 && aChar <= charFor9) aChar -= charForA;  /*  eslint-disable-line no-dupe-else-if */
        if (bChar >= charFor0 && bChar <= charFor9) bChar -= charForA;

        if (aChar > bChar) return positivCompare(order);
        if (aChar < bChar) return negativCompare(order);
    }

    return aField.length < bField.length ? positivCompare(aField.length) : 0;
}

export function positivCompare(order = 'ASC') {
    const putFirst = 1;
    const putAfterFirst = -1;

    return (order === 'ASC') ? putFirst : putAfterFirst;
}

export function negativCompare(order = 'ASC') {
    const putFirst = 1;
    const putAfterFirst = -1;

    return (order === 'ASC') ? putAfterFirst : putFirst;
}

export function sortByIsArchived(list) {
    if (!list) return list;

    return [ ...list ]
        ?.sort((a, b) => b?.isArchived && !a.isArchived ? -1 : 0) || [];
}

export function sortEntitiesByType(entities = [], typesOrder = [], sortByActive = false, order = 'ASC') {
    if (!entities) return entities;

    const sortedByLabel = [ ...entities ]?.sort((a, b) => {
        const aField = a?.label?.toLowerCase() || '';
        const bField = b?.label?.toLowerCase() || '';

        return sortComparator(aField, bField, order);
    });

    if (!typesOrder?.length) return sortedByLabel;

    const entitiesWithSortedKeys = sortedByLabel?.map(entity => {
        const sortOrder = typesOrder?.findIndex(type => {
            switch (type) {
                case 'ACTIVE_DEVICE':
                    return entity?.type === 'DEVICE' && entity.isActive;
                case 'INACTIVE_DEVICE':
                    return entity?.type === 'DEVICE' && !entity.isActive;
                default:
                    return type === entity?.type;
            }
        });

        return ({
            ...entity,
            sortOrder : sortOrder > -1 ? sortOrder : typesOrder?.length + 1
        });
    });

    const sortedByTypes = entitiesWithSortedKeys?.sort((a, b) => {
        const aField = a?.sortOrder;
        const bField = b?.sortOrder;

        if (bField === aField) return 0;

        return aField < bField ? -1 : 1;
    });

    if (!sortByActive) return sortedByTypes;

    const activeItems    = sortedByTypes?.filter(item => item?.isActive);
    const notActiveItems = sortedByTypes?.filter(item => !item?.isActive);

    return [
        ...activeItems,
        ...notActiveItems
    ];
}
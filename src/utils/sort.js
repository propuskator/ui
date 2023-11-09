export function sortComparator(aField, bField, order = 'ASC') {    // order = [ 'ASC', 'DESC' ]
    const length = aField.length < bField.length ? aField.length : bField.length;

    for (const index in new Array(length).fill(null)) { // eslint-disable-line guard-for-in
        if (!aField[index]) return positivCompare(order);
        if (!bField[index]) return negativCompare(order);

        let aChar = aField[index].charCodeAt();
        let bChar = bField[index].charCodeAt();

        const charFor0 = 48;  /* eslint-disable-line more/no-numeric-endings-for-variables*/
        const charFor9 = 57;  /* eslint-disable-line more/no-numeric-endings-for-variables*/
        // 75?
        const charForA = 41;  /* eslint-disable-line more/no-numeric-endings-for-variables*/


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
        ?.sort((a, b) => b?.isArchived && !a.isArchived ? -1 : 0) || []; // eslint-disable-line no-magic-numbers
}

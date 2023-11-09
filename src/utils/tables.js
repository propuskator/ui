import * as localStorageUtils   from 'templater-ui/src/utils/helpers/localStorage';
import { TABLE_COLUMNS_KEY }    from 'Constants/localStorage';


export function setTableColumnsInStorage(tableName = '', visibleColumns = []) {
    const tablesConfig = localStorageUtils.getData(TABLE_COLUMNS_KEY);

    localStorageUtils.saveData(TABLE_COLUMNS_KEY, {
        ...tablesConfig,
        [tableName] : visibleColumns
    });
}

export function resetFiltersByColumns(columns = [], filters = {}, defaultSortBy = '') {
    const _filters = { ...filters, order: 'DESC' };

    columns.forEach(column => {
        if (column === _filters.sortedBy) _filters.sortedBy = defaultSortBy;

        switch (column) {
            case 'createdAt':
                _filters.createStart = '';
                _filters.createEnd = '';
                break;
            case 'updatedAt':
                _filters.updateStart = '';
                _filters.updateEnd = '';
                break;
            case 'readersGroups':
                _filters.accessReadersGroupIds = [];
                break;
            default:
                break;
        }
    });

    return _filters;
}

import { sortComparator } from './../../../../../utils/sort';
import { initCountries }  from './countriesList';

export const COUNTRIES_LIST = initCountries().sort((a, b) => {
    const firstLabel  = a?.name?.toLowerCase() || '';
    const secondLabel = b?.name?.toLowerCase() || '';

    return sortComparator(firstLabel, secondLabel, 'ASC');
});

import { themes as iconThemes } from './components/icon';

const BASE_THEME = {
    ...iconThemes.base
};

export const THEMES_MAP = {
    BLUE   : 'BLUE',
    VIOLET : 'VIOLET',
    GREEN  : 'GREEN',
    RUST   : 'RUST'
};

export const DEFAULT_THEME    = THEMES_MAP.GREEN;
export const AVAILABLE_THEMES = Object.values(THEMES_MAP);

export const THEMES = {
    [THEMES_MAP.BLUE] : {
        ...BASE_THEME,
        '--color_sidebar'      : '#2f364f',
        '--color_primary--100' : '#3b7ec126',
        '--color_primary--300' : '#207AD4C2',
        '--color_primary--500' : '#3b7ec1',
        '--color_primary--600' : '#207ad4',
        '--color_primary--700' : '#1066bb',
        '--color_primary--900' : '#0f5293'
    },
    [THEMES_MAP.VIOLET] : {
        ...BASE_THEME,
        '--color_sidebar'      : '#3c2f4f',
        '--color_primary--100' : '#9c27b026',
        '--color_primary--300' : '#9C27B0A1',
        '--color_primary--500' : '#9c27b0d6',
        '--color_primary--600' : '#9c27b0',
        '--color_primary--700' : '#7b1fa2',
        '--color_primary--900' : '#4a148c'

    },
    [THEMES_MAP.GREEN] : {
        ...BASE_THEME,
        '--color_sidebar'      : '#2f4f49',
        '--color_primary--100' : '#02948726',
        '--color_primary--300' : '#029487B8',
        '--color_primary--500' : '#029487d6',
        '--color_primary--600' : '#029487',
        '--color_primary--700' : '#068478',
        '--color_primary--900' : '#016d63'
    },
    [THEMES_MAP.RUST] : {
        ...BASE_THEME,
        '--color_sidebar'      : '#292b34',
        '--color_primary--100' : 'rgba(0, 0, 0, 0.1)',
        '--color_primary--300' : '#BEBEBE',
        '--color_primary--500' : 'rgba(0, 0, 0, 0.4)',
        '--color_primary--600' : '#34363F',
        '--color_primary--700' : 'rgba(0, 0, 0, 0.95)',
        '--color_primary--900' : '#000'
    }
};

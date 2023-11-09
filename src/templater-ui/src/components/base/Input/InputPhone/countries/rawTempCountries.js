/* eslint-disable no-magic-numbers, max-len */
// Copied from https://raw.githubusercontent.com/bl00mber/react-phone-input-2/master/src/rawCountries.js

// Country model:
// [
//    Country name,
//    Regions,
//    iso2 code,
//    International dial code,
//    Format (if available),
//    Order (if >1 country with same dial code),
//    Area codes (if >1 country with same dial code)
// ]
//
// Regions:
// ['america', 'europe', 'asia', 'oceania', 'africa']
//
// Sub-regions:
// ['north-america', 'south-america', 'central-america', 'carribean',
//  'eu-union', 'ex-ussr', 'ex-yugos', 'baltic', 'middle-east', 'north-africa']


const rawCountries = [
    [
        'Канада',
        [ 'america', 'north-america' ],
        'ca',
        '1',
        '+. (...) ...-....',
        1,
        [ '204', '226', '236', '249', '250', '289', '306', '343', '365', '387', '403', '416', '418', '431', '437', '438', '450', '506', '514', '519', '548', '579', '581', '587', '604', '613', '639', '647', '672', '705', '709', '742', '778', '780', '782', '807', '819', '825', '867', '873', '902', '905' ]
    ],
    [
        'Великобритания',
        [ 'europe', 'eu-union' ],
        'gb',
        '44',
        '+.. ....-......'
    ],
    [
        'Бельгия',
        [ 'europe', 'eu-union' ],
        'be',
        '32',
        '+..-...-..-..-..'
    ],
    [
        'Китай',
        [ 'asia' ],
        'cn',
        '86',
        '+.. ..-.........'
    ],
    [
        'Кипр',
        [ 'europe', 'eu-union' ],
        'cy',
        '357',
        '+...-..-......'
    ],
    [
        'Эстония',
        [ 'europe', 'eu-union', 'ex-ussr', 'baltic' ],
        'ee',
        '372',
        '+...-....-......'
    ],
    [
        'Финляндия',
        [ 'europe', 'eu-union', 'baltic' ],
        'fi',
        '358',
        '+...-..-...-..-..'
    ],
    [
        'Франция',
        [ 'europe', 'eu-union' ],
        'fr',
        '33',
        '+..-.-..-..-..-..'
    ],
    [
        'Грузия',
        [ 'asia', 'ex-ussr' ],
        'ge',
        '995'
    ],
    [
        'Германия',
        [ 'europe', 'eu-union', 'baltic' ],
        'de',
        '49',
        '+..-....-........'
    ],
    [
        'Гонконг',
        [ 'asia' ],
        'hk',
        '852',
        '+...-....-....'
    ],
    [
        'Ирландия',
        [ 'europe', 'eu-union' ],
        'ie',
        '353',
        '+...-..-.......'
    ],
    [
        'Израиль',
        [ 'middle-east' ],
        'il',
        '972',
        '+...-...-... ....'
    ],
    [
        'Италия',
        [ 'europe', 'eu-union' ],
        'it',
        '39',
        '+..-...-.......',
        0
    ],
    [
        'Испания',
        [ 'europe', 'eu-union' ],
        'es',
        '34',
        '+..-...-...-...'
    ],
    [
        'Россия',
        [ 'europe', 'asia', 'ex-ussr', 'baltic' ],
        'ru',
        '7',
        '+. (...) ...-..-..',
        0
    ],
    [
        'Турция',
        [ 'europe' ],
        'tr',
        '90',
        '+..-...-...-..-..'
    ],
    [
        'Украина',
        [ 'europe', 'ex-ussr' ],
        'ua',
        '380',
        '+... (..) ...-..-..'
    ]
];

export default rawCountries;

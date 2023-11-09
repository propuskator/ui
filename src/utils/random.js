export function generateUniqueRandomNumbersBetween(start, finish, n = 1, result = [], _i = 0) {
    if (_i >= n) return result;
    const len = finish - start + 1;

    if (result.length >= len) return result;

    const rand = Math.floor(Math.random() * (len));

    if (result.includes(rand)) return generateUniqueRandomNumbersBetween(start, finish, n, result, _i);

    return generateUniqueRandomNumbersBetween(start, finish, n, [ ...result, rand ], ++_i);
}

export function safeParseJSON(value, defaultValue) {
    try {
        return JSON.parse(value);
    } catch {
        return defaultValue;
    }
}

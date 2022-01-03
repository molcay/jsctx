export function now(): Date {
    return new Date();
}

export function isUndefinedOrNull(value: unknown): boolean {
    return isUndefined(value) || isNull(value);
}

export function isUndefined(value: unknown): boolean {
    return typeof(value) === 'undefined';
}

export function isNull(value: unknown): boolean {
    return value === null;
}

export function isArray(value: unknown): boolean {
    return Array.isArray(value);
}

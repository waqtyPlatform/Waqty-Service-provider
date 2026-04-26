/**
 * Safely parse a JSON string, returning a fallback if the input is null/empty
 * or if parsing throws. Used to harden localStorage reads against corrupted
 * values that would otherwise crash hydration.
 */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

export function safeLocalStorageGet<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
        return safeJsonParse<T>(localStorage.getItem(key), fallback);
    } catch {
        return fallback;
    }
}

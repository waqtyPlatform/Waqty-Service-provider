'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApiResponse } from '@/lib/api';

interface UseApiQueryOptions {
    enabled?: boolean;
    fallbackData?: unknown;
}

interface UseApiQueryResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    /** True when the fetch failed and `fallbackData` is being shown instead — so the UI can flag "sample data" rather than silently masking the outage. */
    isFallback: boolean;
    refetch: () => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useApiQuery<T = any>(
    fetcher: () => Promise<ApiResponse<T>> | Promise<ApiResponse<any>>,
    /* eslint-enable @typescript-eslint/no-explicit-any */
    deps: unknown[] = [],
    options: UseApiQueryOptions = {}
): UseApiQueryResult<T> {
    const { enabled = true, fallbackData } = options;
    const [data, setData] = useState<T | null>((fallbackData as T) ?? null);
    const [loading, setLoading] = useState(enabled);
    const [error, setError] = useState<string | null>(null);
    const [isFallback, setIsFallback] = useState(false);
    const mountedRef = useRef(true);
    // Keep the latest fetcher in a ref so the deps-keyed `fetchData` below always
    // calls the current closure (no stale-fetcher bug) without listing `fetcher`
    // (a new identity every render) in its dependency array.
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;
    // Monotonic request id: when `deps` change a new request starts; only the
    // newest one is allowed to apply state, so a slower earlier response can't
    // clobber a newer one (out-of-order setState race).
    const requestIdRef = useRef(0);

    const fetchData = useCallback(async () => {
        if (!enabled) return;
        const myId = ++requestIdRef.current;
        const isCurrent = () => mountedRef.current && myId === requestIdRef.current;
        setLoading(true);
        setError(null);
        try {
            const response = await fetcherRef.current();
            if (isCurrent()) {
                setData(response.data ?? null);
                setIsFallback(false);
            }
        } catch (err: unknown) {
            if (isCurrent()) {
                if (fallbackData !== undefined) {
                    // API unavailable — show fallback data but flag it so the UI can
                    // surface a "sample data" notice instead of masking the outage.
                    setData(fallbackData as T);
                    setIsFallback(true);
                } else {
                    // No fallback — show error to user
                    const message =
                        err && typeof err === 'object' && 'message' in err
                            ? (err as { message: string }).message
                            : 'An error occurred';
                    setError(message);
                }
            }
        } finally {
            if (isCurrent()) {
                setLoading(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, ...deps]);

    useEffect(() => {
        mountedRef.current = true;
        fetchData();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchData]);

    return { data, loading, error, isFallback, refetch: fetchData, setData };
}

interface UseApiMutationResult<T, V = Record<string, unknown>> {
    mutate: (variables: V) => Promise<T | null>;
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApiMutation<T, V = Record<string, unknown>>(
    mutator: (variables: V) => Promise<ApiResponse<T>>
): UseApiMutationResult<T, V> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutate = useCallback(
        async (variables: V): Promise<T | null> => {
            setLoading(true);
            setError(null);
            try {
                const response = await mutator(variables);
                setData(response.data ?? null);
                return response.data ?? null;
            } catch (err: unknown) {
                const message =
                    err && typeof err === 'object' && 'message' in err
                        ? (err as { message: string }).message
                        : 'An error occurred';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [mutator]
    );

    return { mutate, data, loading, error };
}

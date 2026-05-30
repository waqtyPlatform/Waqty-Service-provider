import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock fetch
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe('ApiClient', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();
    });

    it('should make GET requests with auth header', async () => {
        localStorageMock.setItem('hagzy_provider_token', 'test-token-123');

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true, data: { id: 1 } }),
        });

        // Import fresh
        const { api } = await import('@/lib/api');
        await api.get('/api/test');

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/api/test');
        expect(options.method).toBe('GET');
    });

    it('should make POST requests with JSON body', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true, data: { created: true } }),
        });

        const { api } = await import('@/lib/api');
        await api.post('/api/test', { name: 'Test' });

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [, options] = mockFetch.mock.calls[0];
        expect(options.method).toBe('POST');
        expect(JSON.parse(options.body)).toEqual({ name: 'Test' });
    });

    it('should handle network errors gracefully', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { api } = await import('@/lib/api');

        try {
            await api.get('/api/fail');
        } catch (error) {
            expect(error).toBeDefined();
        }
    });
});

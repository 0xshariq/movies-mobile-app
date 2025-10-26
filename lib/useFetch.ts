import { useEffect, useState, useRef, useCallback } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const mounted = useRef(true)
    const fetchFnRef = useRef(fetchFunction)

    // keep a ref to the latest fetchFunction so callers can pass inline
    // callbacks without forcing the hook to re-run the effect each render.
    useEffect(() => {
        fetchFnRef.current = fetchFunction
    }, [fetchFunction])

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFnRef.current();
            if (mounted.current) setData(result);
        } catch (err) {
            if (mounted.current) setError(err instanceof Error ? err : new Error('Fetch Failed', { cause: err }));
        } finally {
            if (mounted.current) setLoading(false);
        }
    }, []);

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(autoFetch);
    }

    // Only auto-run when `autoFetch` changes. We intentionally do not include
    // `fetchFunction` in the dependency array because callers often pass an
    // inline callback which would otherwise trigger a fetch every render.
    // Consumers who need reactive refetching should call `refetch` manually or
    // pass a stable callback (useCallback) as `fetchFunction`.
    useEffect(() => {
        if (!autoFetch) return

        mounted.current = true
        fetchData()

        return () => {
            mounted.current = false
        }
    }, [autoFetch, fetchData]);

    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;
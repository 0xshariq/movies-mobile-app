import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Fetch Failed', { cause: err }));
        } finally {
            setLoading(false);
        }
    }

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(autoFetch);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    });

    return { data, loading, error, refetch: fetchData, reset };
}

export default useFetch;
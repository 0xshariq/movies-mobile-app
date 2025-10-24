import axios from 'axios';

export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY || '',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_READ_ACCESS_TOKEN || ''}`
    }
}

export const fetchMovies = async ({ query }: { query: string }) => {
    const url = query ?
        `/search/movie?query=${encodeURIComponent(query)}` :
        `/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
    const response = await axios.get(`${TMDB_CONFIG.BASE_URL}${url}`, {
        headers: TMDB_CONFIG.headers,
        params: {
            api_key: TMDB_CONFIG.API_KEY
        }
    });
    if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText || ''}`);
    }
    const data = response.data;
    return data.results;
}

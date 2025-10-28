import { ID } from 'appwrite';
import { databases, Query } from './appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '';
const MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_MOVIES_COLLECTION_ID || '';

export async function updateSearchCount(query: string, movies: Movie) {
    try {
        const result = await databases.listDocuments(DATABASE_ID, MOVIES_COLLECTION_ID, [
            Query.equal('searchTerm', query),
        ]);
        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
            await databases.updateDocument(
                DATABASE_ID,
                MOVIES_COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            );
        } else {
            await databases.createDocument(DATABASE_ID, MOVIES_COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movies.id,
                title: movies.title,
                poster_path: `https://image.tmdb.org/t/p/w500${movies.poster_path}`,
                count: 1,
            });
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await databases.listDocuments(DATABASE_ID, MOVIES_COLLECTION_ID, [
            Query.limit(10),
            Query.orderDesc('count'),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (error) {
        console.log(error);
        throw error;
    }
}
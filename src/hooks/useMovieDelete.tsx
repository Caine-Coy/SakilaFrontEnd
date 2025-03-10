import { useCallback } from 'react';
import { API_URL } from '../components/config';

interface UseMovieDeleteProps {
    onMovieDeleted: (movieId: number) => void;
}
export function useMovieDelete({ onMovieDeleted }: UseMovieDeleteProps) {
    const deleteMovie = useCallback(async (movieId: number) => {
        try {
            const response = await fetch(API_URL + "/films/${movieId}", {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete movie');
            }

            onMovieDeleted(movieId);
        } catch (error) {
            console.error('Error deleting movie:', error);
            throw new Error('Failed to delete movie');
        }
    }, [onMovieDeleted]);

    return { deleteMovie };
}
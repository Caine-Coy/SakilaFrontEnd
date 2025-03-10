import { useCallback } from 'react';

interface UseMovieDeleteProps {
    onMovieDeleted: (movieId: number) => void;
}
let url = "http://sakila-db.c72ogo8s0ap6.eu-north-1.rds.amazonaws.com:8080";
export function useMovieDelete({ onMovieDeleted }: UseMovieDeleteProps) {
    const deleteMovie = useCallback(async (movieId: number) => {
        try {
            const response = await fetch(url + "/films/${movieId}", {
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
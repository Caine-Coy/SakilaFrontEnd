import { API_URL } from '../components/config';
import { Movie } from '../types/Movie';

export function useMovieUpdate() {
    const updateMovie = async (movieId: number, updatedData: Partial<Movie>) => {
        try {
            const response = await fetch(`${API_URL}/films/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Failed to update movie');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating movie:', error);
            throw new Error('Failed to update movie');
        }
    };

    return { updateMovie };
}
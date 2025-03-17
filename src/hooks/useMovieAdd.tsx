import { API_URL } from '../components/config';

interface MovieFormData {
    title: string;
    description: string;
    releaseYear: number;
    languageId: number;
    originalLanguageID: number;
    rating?: string;
    length?: number;
}

export function useMovieAdd() {
    const addMovie = async (movieData: MovieFormData) => {
        try {
            const response = await fetch(`${API_URL}/films`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(movieData)
            });

            if (!response.ok) {
                throw new Error('Failed to add movie');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding movie:', error);
            throw new Error('Failed to add movie');
        }
    };

    return { addMovie };
}
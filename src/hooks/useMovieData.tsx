import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';
import { Actor } from '../types/Actor';
import { API_URL } from '../components/config';

export interface MovieWithActors extends Movie {
    actors: Actor[];
}

export function useMovieData() {
    const [movies, setMovies] = useState<MovieWithActors[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                };

                const [moviesResponse, actorsResponse] = await Promise.all([
                    fetch(`${API_URL}/films`, requestOptions),
                    fetch(`${API_URL}/actors`, requestOptions)
                ]);

                if (!moviesResponse.ok || !actorsResponse.ok) {
                    throw new Error('Failed to fetch data from the server');
                }

                const moviesData: Movie[] = await moviesResponse.json();
                const actorsData: Actor[] = await actorsResponse.json();

                const moviesWithActors = moviesData.map(movie => ({
                    ...movie,
                    actors: actorsData.filter(actor =>
                        actor.films.some(film => film.id === movie.id)
                    )
                }));

                setMovies(moviesWithActors);
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to fetch movie data. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getDetailedMovie = async (movieId: number) => {
        try {
            const response = await fetch(`${API_URL}/films/${movieId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            
            const detailedMovie = await response.json();
            const baseMovie = movies.find(m => m.id === movieId);
            
            // Combine the detailed movie data with the base movie's actors
            return {
                ...detailedMovie,
                actors: baseMovie?.actors || [],
                desc: detailedMovie.desc || baseMovie?.desc, // Ensure description is included
                rating: detailedMovie.rating || baseMovie?.rating
            };
        } catch (error) {
            console.error('Error fetching movie details:', error);
            // Return the base movie if detailed fetch fails
            return movies.find(m => m.id === movieId);
        }
    };

    const removeMovie = (movieId: number) => {
        setMovies(prev => prev.filter(movie => movie.id !== movieId));
    };

    return { movies, isLoading, error, getDetailedMovie, removeMovie };
}
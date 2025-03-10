import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';
import { Actor } from '../types/Actor';

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
                const [moviesResponse, actorsResponse] = await Promise.all([
                    fetch("http://localhost:8080/films"),
                    fetch("http://localhost:8080/actors")
                ]);

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
                setError('Failed to fetch movie data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getDetailedMovie = async (movieId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/films/${movieId}`);
            const detailedMovie = await response.json();
            const baseMovie = movies.find(m => m.id === movieId);
            //merge actors into detailedMovie
            return { ...detailedMovie, actors: baseMovie?.actors || [] };
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return movies.find(m => m.id === movieId);
        }
    };

    const removeMovie = (movieId: number) => {
        setMovies(prev => prev.filter(movie => movie.id !== movieId));
    };

    return { movies, isLoading, error, getDetailedMovie, removeMovie };
}
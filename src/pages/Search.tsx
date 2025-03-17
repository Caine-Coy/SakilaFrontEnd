import { useState } from 'react';
import { MovieWithActors, useMovieData } from '../hooks/useMovieData';
import { useMovieDelete } from '../hooks/useMovieDelete';
import MovieCard from '../components/MovieCard';
import './Search.css';
import { Movie } from '../types/Movie';
import { useMovieUpdate } from '../hooks/useMovieUpdate';

function Search({ isAdmin = false }) {
    const [query, setQuery] = useState('');
    const { movies, isLoading, error, getDetailedMovie, removeMovie } = useMovieData();
    const [detailedMovies, setDetailedMovies] = useState<Record<number, MovieWithActors>>({});
    const { updateMovie } = useMovieUpdate(); // Move hook to top level

    const { deleteMovie } = useMovieDelete({
        onMovieDeleted: (movieId: number) => {
            setDetailedMovies(currentMovies => {
                // Create a new object without the deleted movie
                const updatedMovies = { ...currentMovies };
                delete updatedMovies[movieId];
                return updatedMovies;
            });
            // Remove from undetailed movies list
            removeMovie(movieId);
        }
    });

    const handleMovieHover = async (movieId: number) => {
        if (!detailedMovies[movieId]) {
            try {
                const detailed = await getDetailedMovie(movieId);
                setDetailedMovies(prev => ({ ...prev, [movieId]: detailed }));
            } catch (error) {
                console.error('Error loading detailed movie:', error);
            }
        }
    };

    const handleMovieUpdate = async (movieId: number, updatedData: Partial<Movie>) => {
        try {
            // Update the movie in the database
            await updateMovie(movieId, updatedData);
            
            // Update the local state
            setDetailedMovies(prev => ({
                ...prev,
                [movieId]: {
                    ...prev[movieId],
                    ...updatedData
                }
            }));

            // Refresh the detailed data
            const updated = await getDetailedMovie(movieId);
            setDetailedMovies(prev => ({
                ...prev,
                [movieId]: updated
            }));
        } catch (error) {
            console.error('Error updating movie:', error);
        }
    };

    if (isLoading) return <div className="loadingMsg">Loading movies...</div>;
    if (error) return <div className="loadingMsg">Error: {error}</div>;

    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="search-input"
            />
            
            {query.length > 1 && (
                <div className="movie-list">
                    {filteredMovies.map(movie => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            actors={movie.actors}
                            onHover={handleMovieHover}
                            detailedData={detailedMovies[movie.id]}
                            isAdmin={isAdmin}
                            onDelete={deleteMovie}
                            onUpdate={handleMovieUpdate} // Add this prop
                        />
                    ))}
                    {filteredMovies.length === 0 && (
                        <div className="no-results">No movies found matching "{query}"</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;

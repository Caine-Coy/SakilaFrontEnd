import { useState } from 'react';
import { MovieWithActors, useMovieData } from '../hooks/useMovieData';
import { useMovieDelete } from '../hooks/useMovieDelete';
import MovieCard from '../components/MovieCard';
import './Search.css';

function Search({ isAdmin = false }) {
    const [query, setQuery] = useState('');
    //all of these variables are coming from useMovieData
    const { movies, isLoading, error, getDetailedMovie, removeMovie } = useMovieData();
    const [detailedMovies, setDetailedMovies] = useState<Record<number, MovieWithActors>>({});

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

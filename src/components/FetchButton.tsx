import { useState } from "react";
import './FetchButton.css';
import MovieCard from "./MovieCard";
import { useMovieData, MovieWithActors } from "../hooks/useMovieData";

function FetchButton() {
    const { movies, isLoading, error, getDetailedMovie } = useMovieData();
    const [randomMovie, setRandomMovie] = useState<MovieWithActors | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const GetRandomMovie = async () => {
        if (movies.length > 0) {
            setIsLoadingDetails(true);
            const randomIndex = Math.floor(Math.random() * movies.length);
            const selectedMovie = movies[randomIndex];

            try {
                const detailedMovie = await getDetailedMovie(selectedMovie.id);
                setRandomMovie(detailedMovie);
            } catch (error) {
                console.error('Error:', error);
                setRandomMovie(selectedMovie);
            } finally {
                //once finished.
                setIsLoadingDetails(false);
            }
        }
    };

    if (isLoading) return <div className="loadingMsg">Loading movies...</div>;
    if (error) return <div className="loadingMsg">Error: {error}</div>;

    return (
        <div className="container">
            <button
                className="random-button"
                disabled={movies.length === 0 || isLoadingDetails}
                onClick={GetRandomMovie}
            >
                {isLoadingDetails ? 'Loading...' : 'Get Random Movie'}
            </button>
            {randomMovie && 
                <div>
                <MovieCard
                    movie={randomMovie}
                    actors={randomMovie.actors}
                    featured={true}
                /> 
                </div>
            }
            
        </div>
    );
}

export default FetchButton;
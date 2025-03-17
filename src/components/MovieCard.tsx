import { useState } from 'react';
import { MovieWithActors } from '../hooks/useMovieData';
import './MovieCard.css';
import { Movie } from "../types/Movie";
import { Actor } from "../types/Actor";
import AIDescriptor from './AIDescriptor';
import { FaPen } from 'react-icons/fa';
import MovieForm from './MovieForm';

interface MovieCardProps {
    movie: Movie;
    featured?: boolean;
    actors?: Actor[];
    onHover?: (movieId: number) => Promise<void>;
    detailedData?: MovieWithActors;
    isAdmin?: boolean;
    onDelete?: (movieId: number) => Promise<void>;
    onUpdate?: (movieId: number, updatedData: Partial<Movie>) => Promise<void>;
}

function MovieCard({
    movie,
    featured = false,
    actors,
    onHover,
    detailedData,
    isAdmin = false,
    onDelete,
    onUpdate
}: MovieCardProps) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: movie.title || '',
        desc: movie.desc || '',
        releaseYear: movie.releaseYear || new Date().getFullYear().toString(),
        rating: movie.rating || ''
    });

    const handleExpand = async () => {
        if (!featured && onHover && !isExpanded) {
            await onHover(movie.id);
        }
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
    };

    // Touch event handlers
    const handleTouchStart = (_: React.TouchEvent) => {
    };

    const handleTouchEnd = (_: React.TouchEvent) => {
        if (isExpanded) {
            handleCollapse();
        } else {
            handleExpand();
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Stops you being able to click through the button
        if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
            try {
                await onDelete?.(movie.id);
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditData({
            title: displayMovie.title || '',
            desc: displayMovie.desc || '',
            releaseYear: displayMovie.releaseYear || new Date().getFullYear().toString(),
            rating: displayMovie.rating || ''
        });
        setIsEditing(true);
    };

    const generatePosterColors = (title: string) => {

        //Splits the title into an array of characters, then reduces it to a single value
        const hash = title.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        // //gets an HSL (Hue Saturation Light) value from that value
        const hue = hash % 360;
        return {
            primary: `hsl(${hue}, 100%, 80%)`,
            secondary: `hsl(${(hue + 180) % 360}, 100%, 80%)`
        };
    };

    const colors = generatePosterColors(movie.title);
    const displayMovie = detailedData || movie;

    return (
        <div
            className={`movie-card ${movie.title} ${featured || isExpanded ? 'featured' : ''}`}
            onMouseEnter={handleExpand}
            onMouseLeave={handleCollapse}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: 'pointer' }}
        >
            {isAdmin && (featured || isExpanded) && (
                <div className="admin-controls">
                    <button
                        className="edit-button"
                        onClick={handleEdit}
                        title="Edit Movie"
                    >
                        <FaPen size={14} />
                    </button>
                    <button
                        className={`${movie.title} delete-button`}
                        onClick={handleDelete}
                        title="Delete Movie"
                    >
                        ×
                    </button>
                </div>
            )}

            {isEditing ? (
                <MovieForm
                    initialData={displayMovie}
                    onSubmit={async (data) => {
                        await onUpdate?.(movie.id, { ...data, releaseYear: data.releaseYear.toString() });
                        setIsEditing(false);
                        if (onHover) {
                            await onHover(movie.id);
                        }
                    }}
                    onCancel={() => setIsEditing(false)}
                    isEdit={true}
                />
            ) : (
                <>
                    {(featured || isExpanded) && (
                        <div
                            className="movie-poster"
                            style={{
                                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                            }}
                        >
                            <div className="poster-content">
                                <h2>{displayMovie.title}</h2>
                                <div className="poster-year">{displayMovie.releaseYear}</div>
                            </div>
                        </div>
                    )}

                    <div className="movie-details">
                        {!featured && !isExpanded && (
                            <><h2>{displayMovie.title}</h2><p>Released: {displayMovie.releaseYear}</p></>
                        )}
                        {displayMovie.desc && <p>{displayMovie.desc}</p>}
                        {(featured && <AIDescriptor movie={movie} />)}
                        {displayMovie.rating && <p>Age Rating: {displayMovie.rating}</p>}
                        {(featured || isExpanded) && actors && (
                            <div className="actors-section">
                                <h3>Cast:</h3>
                                <ul>
                                    {actors.map(actor => (
                                        <li key={actor.id}>
                                            {actor.firstName} {actor.lastName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default MovieCard;
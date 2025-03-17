import { useState } from 'react';
import { MovieWithActors } from '../hooks/useMovieData';
import './MovieCard.css';
import { Movie } from "../types/Movie";
import { Actor } from "../types/Actor";
import AIDescriptor from './AIDescriptor';
import { FaPen } from 'react-icons/fa';

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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onUpdate?.(movie.id, editData);
            setIsEditing(false);
            
            if (onHover) {
                await onHover(movie.id);
            }
            
            // Update the local state with new data
            if (detailedData) {
                detailedData = {
                    ...detailedData,
                    ...editData
                };
            }
        } catch (error) {
            console.error('Error saving movie:', error);
        }
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
                <form onSubmit={handleSave} className="edit-form" onClick={e => e.stopPropagation()}>
                    <input
                        type="text"
                        value={editData.title}
                        onChange={e => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Title"
                    />
                    <textarea
                        value={editData.desc}
                        onChange={e => setEditData(prev => ({ ...prev, desc: e.target.value }))}
                        placeholder="Description"
                    />
                    <input
                        type="number"
                        value={editData.releaseYear || ''}
                        onChange={e => setEditData(prev => ({ 
                            ...prev, 
                            releaseYear: e.target.value || new Date().getFullYear().toString()
                        }))}
                        placeholder="Release Year"
                        min="1900"
                        max={new Date().getFullYear()}
                    />
                    <select
                        value={editData.rating}
                        onChange={e => setEditData(prev => ({ ...prev, rating: e.target.value }))}
                    >
                        <option value="">Select Rating</option>
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                        <option value="NC-17">NC-17</option>
                    </select>
                    <div className="edit-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
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
                        {(featured && <AIDescriptor movie={movie}/>)}
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
import { useState } from 'react';
import { useMovieAdd } from '../hooks/useMovieAdd';
import MovieForm from '../components/MovieForm';
import './AddMovie.css';

// Update interface to match the API format
interface MovieFormData {
    title: string;
    description: string;
    releaseYear: number;
    languageId: number;
    originalLanguageID: number;
    rating?: string;
    length?: number;
}

function AddMovie({ isAdmin = false }) {
    const { addMovie } = useMovieAdd();

    if (!isAdmin) {
        return <h1>Sorry, you are not authorized to view this page</h1>;
    }

    const handleSubmit = async (data: MovieFormData) => {
        try {
            await addMovie(data);
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    };

    return (
        <div className="movie-form-container">
            <h2>Add New Movie</h2>
            <MovieForm
                onSubmit={handleSubmit}
                isEdit={false}
            />
        </div>
    );
}

export default AddMovie;


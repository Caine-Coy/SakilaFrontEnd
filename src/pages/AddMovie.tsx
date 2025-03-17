import { useState } from 'react';
import { useMovieAdd } from '../hooks/useMovieAdd';
import './AddMovie.css';

interface MovieFormData {
    title: string;
    desc: string;
    releaseYear: string;
    languageID: number;
    length: number;
    rating: string;
}

const defaultFormData: MovieFormData = {
    title: '',
    desc: '',
    releaseYear: new Date().getFullYear().toString(),
    languageID: 1,
    length: 0,
    rating: 'G'
};

function AddMovie({ isAdmin = false }) {
    const [formData, setFormData] = useState<MovieFormData>(defaultFormData);
    const { addMovie } = useMovieAdd();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMovie(formData);
            alert('Movie added successfully!');
            setFormData(defaultFormData);
        } catch (error) {
            console.error('Error adding movie:', error);
            alert('Failed to add movie');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isAdmin) {
        return <h1>Sorry, you are not authorized to view this page</h1>;
    }

    return (
        <div className="movie-form-container">
            <h2>Add New Movie</h2>
            <form onSubmit={handleSubmit} className="movie-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="desc">Description:</label>
                    <textarea
                        id="desc"
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="releaseYear">Release Year:</label>
                    <input
                        type="number"
                        id="releaseYear"
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleChange}
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="length">Length (minutes):</label>
                    <input
                        type="number"
                        id="length"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                    >
                        <option value="G">G</option>
                        <option value="PG">PG</option>
                        <option value="PG-13">PG-13</option>
                        <option value="R">R</option>
                        <option value="NC-17">NC-17</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">Add Movie</button>
            </form>
        </div>
    );
}

export default AddMovie;


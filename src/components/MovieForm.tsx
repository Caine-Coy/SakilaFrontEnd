import { useState, useEffect } from 'react';
import './MovieForm.css';
import { Movie } from '../types/Movie';

// Update interface to match API format
interface MovieFormData {
    id?: number;
    title: string;
    description: string; // Changed from desc
    releaseYear: number; // Changed to number
    languageId: number; // Changed from languageID
    originalLanguageID: number;
    rating?: string; // Optional fields at the end
    length?: number;
}

interface MovieFormProps {
    initialData?: Partial<Movie>;
    onSubmit: (data: MovieFormData) => Promise<void>;
    onCancel?: () => void;
    isEdit?: boolean;
}

function MovieForm({ initialData, onSubmit, onCancel, isEdit = false }: MovieFormProps) {
    const defaultData: MovieFormData = {
        title: '',
        description: '', // Changed from desc
        releaseYear: new Date().getFullYear(),
        languageId: 1,
        originalLanguageID: 1,
        rating: '',
        length: 0
    };

    const [formData, setFormData] = useState<MovieFormData>({
        ...defaultData,
        ...initialData,
        description: initialData?.desc || '',
        releaseYear: initialData?.releaseYear ? parseInt(initialData.releaseYear) : new Date().getFullYear(),
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                description: initialData.desc || prev.description,
                releaseYear: initialData.releaseYear ? parseInt(initialData.releaseYear) : prev.releaseYear,
            }));
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submissionData: MovieFormData = {
                ...(isEdit && initialData?.id ? { id: initialData.id } : {}),
                title: formData.title,
                description: formData.description,
                releaseYear: Number(formData.releaseYear),
                languageId: 1,
                originalLanguageID: 1,
                rating: formData.rating,
                length: formData.length
            };

            await onSubmit(submissionData);
            if (!isEdit) {
                setFormData(defaultData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="movie-form" onClick={e => e.stopPropagation()}>
            <div className="form-group">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    required
                />
            </div>

            <div className="form-group">
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    required
                />
            </div>

            <div className="form-group">
                <input
                    type="number"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    placeholder="Release Year"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                />
            </div>

            <div className="form-group">
                <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Rating</option>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                    <option value="NC-17">NC-17</option>
                </select>
            </div>

            {!isEdit && (
                <div className="form-group">
                    <input
                        type="number"
                        name="length"
                        value={formData.length}
                        onChange={handleChange}
                        placeholder="Length (minutes)"
                        min="1"
                        required
                    />
                </div>
            )}

            <div className="form-buttons">
                <button type="submit">
                    {isEdit ? 'Save Changes' : 'Add Movie'}
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default MovieForm;
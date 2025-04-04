import { useState, useEffect } from "react";
import OpenAI from 'openai';
import { Movie } from "../types/Movie";
import { LLM_URL } from "../components/config";

interface AIDescriptorProps {
    movie?: Movie;
}

function AIDescriptor({ movie }: AIDescriptorProps) {
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Skip if already initialized for this movie
        const movieId = movie?.id;
        if (isInitialized && !movieId) return;

        const generateMessage = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const openai = new OpenAI({
                    apiKey: 'sk-no-key-required',
                    baseURL: LLM_URL,
                    defaultHeaders: {
                        'Content-Type': 'application/json',
                    },
                    dangerouslyAllowBrowser: true,
                });

                try {
                    const response = await fetch('http://localhost:1234/v1/models');
                    if (!response.ok) {
                        throw new Error('LM Studio server returned an error.');
                    }
                } catch (e) {
                    console.error('Server check error:', e);
                    throw new Error('Server check error');
                }
                if (movie) {
                    // Format actors names into a readable string
                    const actorNames = movie.actors
                        ? movie.actors.map(actor => `${actor.firstName} ${actor.lastName}`).join(', ')
                        : 'Unknown actors';

                    const prompt = `Create a fun, imaginative synopsis for this movie in 2-3 sentences: "${movie.title}" (${movie.releaseYear}).
                    The movie is rated ${movie.rating} and is about: ${movie.desc}
                    The movie stars are ${actorNames}. `;

                    const completion = await openai.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: "You are a creative movie expert who provides entertaining and imaginative movie descriptions. Create an engaging description that mentions the cast but try not to repeat yourself. Please come up with clever made up names for the characters mentioned, but then credit the stars for their roles in brackets."
                            },
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        model: "hermes-3-llama-3.2-3b",
                        temperature: 0.8,
                        stream: false
                    });

                    if (!completion?.choices?.[0]?.message?.content) {
                        throw new Error('Invalid response from LM Studio');
                    }

                    setMessage(completion.choices[0].message.content);
                }
            } catch (error) {
                console.error("Error generating message:", error);
                setError(error instanceof Error ? error.message : "Connection failed. Please check LM Studio settings.");
                setMessage("");
            } finally {
                setIsLoading(false);
                setIsInitialized(true);
            }
        };

        generateMessage();
    }, [movie, isInitialized]);

    return (
        <div className="ai-descriptor">
            <h3>AI Movie Synopsis</h3>
            {error && <p className="error">{error}</p>}
            {isLoading ? (
                <p>Generating content...</p>
            ) : message && (
                <p>{message}</p>
            )}
        </div>
    );
}

export default AIDescriptor;
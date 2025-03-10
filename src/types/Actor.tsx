import { Movie } from './Movie';

export interface Actor {
    id: number;
    firstName: string;
    lastName: string;
    films: Array<Movie>;
}
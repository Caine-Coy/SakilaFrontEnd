import { Actor } from "./Actor";

export interface Movie {
    id: number;
    title: string;
    releaseYear: string;
    language: object;
    desc? : string;
    rating?: string;
    actors?: Array<Actor>;
}
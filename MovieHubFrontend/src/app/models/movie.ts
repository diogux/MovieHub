import { Producer } from "./producer";
import { Actor } from "./actor";
import { Genre } from "./genre";

export interface Movie {
    id: number;
    title: string;
    duration: string;
    producers: Producer[];
    actors: Actor[];
    release_date: string;
    genres: Genre[];
    synopsis: string;
    score: number;
    likes: number;
}

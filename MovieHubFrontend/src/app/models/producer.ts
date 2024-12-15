import { Movie } from './movie';

export interface Producer {
    id: number;
    name: string;
    date_of_birth: string;
    date_of_death: string;
    biography: string;
    picture: string;
    movies: Movie[];
}

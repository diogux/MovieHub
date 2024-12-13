import { Movie } from "./movie";
export interface Genre {
    id: number;
    name: string;
    movies: Movie[];
}

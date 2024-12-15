import { Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { Genre } from '../models/genre';
import { Movie } from '../models/movie';
import { MovieService } from './movie.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private genresUrl = 'http://localhost:8000/api/genres';

  constructor(private http: HttpClient, private movieService: MovieService) { }

  getGenresWithMovies(): Observable<Genre[]> {
    // Fetch genres and movies using the existing MovieService
    return forkJoin({
      genres: this.http.get<Genre[]>(this.genresUrl),
      movies: this.movieService.getMovies(),
    }).pipe(
      map(({ genres, movies }) => {
        // Map movies to their respective genres
        return genres.map(genre => ({
          ...genre,
          movies: movies.filter(movie => movie.genres.includes(genre))
        }));
      })
    );
  }
}

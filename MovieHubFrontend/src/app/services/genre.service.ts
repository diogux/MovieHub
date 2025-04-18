import { Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { Genre } from '../models/genre';
import { MovieService } from './movie.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private genresUrl = environment.baseUrl + 'genres';

  constructor(private http: HttpClient, private movieService: MovieService) { }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(this.genresUrl);
  }

  getGenresWithMovies(): Observable<Genre[]> {
    return forkJoin({
      genres: this.http.get<Genre[]>(this.genresUrl),
      movies: this.movieService.getMovies(),
    }).pipe(
      map(({ genres, movies }) => {
        return genres.map(genre => ({
          ...genre,
          movies: movies.filter(movie => movie.genres.some(g => g.id === genre.id))
        }));
      })

    );
  }
}

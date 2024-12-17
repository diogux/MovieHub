import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = environment.baseUrl + 'movies';

  constructor(private http: HttpClient) { }

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl);
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/${id}`);
  }

getMoviesByIds(ids: number[]): Observable<Movie[]> {
  return this.http.get<Movie[]>(this.baseUrl).pipe(
    map(movies => {
      const filteredMovies = movies.filter(movie => ids.includes(movie.id));
      filteredMovies.forEach(movie => console.log(movie)); 
      return filteredMovies;
    })
  );
}

  getMoviePosterUrl(movie: Movie): string {
    return movie.poster ? `http://localhost:8000${movie.poster}` : '';
  }

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.baseUrl, movie, { withCredentials: true });
  }

  editMovie( formData: FormData,movieId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${movieId}/edit/`, formData, {
      withCredentials: true
    });
  }

  deleteMovie(id: number): Observable<Movie> {
    return this.http.delete<Movie>(`${this.baseUrl}/${id}/del/`, { withCredentials: true });
  }
  

}

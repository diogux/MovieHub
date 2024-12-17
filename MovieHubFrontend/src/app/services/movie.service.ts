import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { environment } from '../../environments/environment';
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

  addMovie(movie: Movie): Observable<Movie> {
    return this.http.post<Movie>(this.baseUrl, movie, { withCredentials: true });
  }
  

}

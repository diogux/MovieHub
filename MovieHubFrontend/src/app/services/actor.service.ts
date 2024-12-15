import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actor } from '../models/actor';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  private baseUrl = environment.baseUrl + 'actors';

  constructor(private http: HttpClient) { }

  getActors(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.baseUrl);
  }

  getActor(id: number): Observable<Actor> {
    return this.http.get<Actor>(`${this.baseUrl}/${id}`);
  }


  getMovies(id: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/${id}/movies`);
  }


}

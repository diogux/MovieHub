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


  getActorMovies(id: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/${id}/movies`);
  }

  addActor(actor: Actor): Observable<Actor> {
    return this.http.post<Actor>(this.baseUrl, actor, { withCredentials: true })
  }

  deleteActor(id: number): Observable<Actor> {
    return this.http.delete<Actor>(`${this.baseUrl}/${id}/del`, { withCredentials: true })
  }

  editActor(formData: FormData, actorId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${actorId}/edit`, formData, { withCredentials: true })
  }

}

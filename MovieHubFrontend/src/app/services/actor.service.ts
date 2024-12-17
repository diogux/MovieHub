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

  addActor(actor: Actor): Observable<Actor>{
    return this.http.post<Actor>(this.baseUrl, actor, {withCredentials:true})
  }

  deleteActor(id: number): Observable<Actor>{
    return this.http.delete<Actor>(`${this.baseUrl}/${id}/delete`, {withCredentials: true})
  }

  editActor(formData: FormData, actorId: number): Observable<any>{
    return this.http.put(`${this.baseUrl}/${actorId}/update`, formData, {withCredentials: true})
  }
  



  // addMovie(movie: Movie): Observable<Movie> {
  //   return this.http.post<Movie>(this.baseUrl, movie, { withCredentials: true });
  // }

  // editMovie( formData: FormData,movieId: number): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${movieId}/edit/`, formData, {
  //     withCredentials: true
  //   });
  // }

  // deleteMovie(id: number): Observable<Movie> {
  //   return this.http.delete<Movie>(`${this.baseUrl}/${id}/del/`, { withCredentials: true });
  // }


  // # ACTORS
  // path('api/actors/add/', views.create_actor, name='actor_add'),
  // path('api/actors/<int:actor_id>/movies/add/', views.create_actor, name='actor_movies_add'),
  // path('api/actors/<int:actor_id>/delete', views.delete_actor, name="delete_actor"),
  // path('api/actors/<int:actor_id>/update', views.edit_actor, name="edit_actor"),


}

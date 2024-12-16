import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

private sessionKey = 'favoriteMovies';

favorites: number[] = [];

  constructor(private http: HttpClient
  ) {}

 getFavorites(): Observable<number[]> {
    return this.http.get<{ liked_movies: number[] }>('http://localhost:8000/api/favorites', {withCredentials: true}).pipe(
      map(response => response.liked_movies) // Extract the `liked_movies` array
    );
  }


  getFavorites_session(): number[] {
    const favorites = sessionStorage.getItem(this.sessionKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite_session(movieId: number): void {
    const favorites = this.getFavorites_session();
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
    }
  }

  removeFavorite_session(movieId: number): void {
    let favorites = this.getFavorites_session();
    favorites = favorites.filter(id => id !== movieId);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
  }

  isFavorite_session(movieId: number): boolean {
    return this.getFavorites_session().includes(movieId);
  }




}

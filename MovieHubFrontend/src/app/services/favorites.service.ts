import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService{

private sessionKey = 'favoriteMovies';
private baseUrl = 'http://localhost:8000/api/favorites/toggle';
private baseFavoritesUrl = 'http://localhost:8000/api/favorites';

  constructor(private http: HttpClient, private auth: AuthService) {
    console.log(auth.is_logged_in());
  }

  // Fetch favorites (SessionStorage for non-logged-in users)
  getFavorites(): Observable<number[]> {
    return this.http.get<number[]>(this.baseFavoritesUrl, { withCredentials: true });
  }

  // Add a movie to favorites
  addFavorite(movieId: number): void {
    console.log(movieId);
    this.http.post(
      this.baseUrl,
      { id: movieId }, // Send "id" instead of "movieId"
      { withCredentials: true } // Include credentials like cookies
    ).subscribe();
  }

  isFavorite(movieId: number, favs: number[]): boolean {
    return favs.includes(movieId);
  }



  // Remove a movie from favorites
  // removeFavorite(movieId: number): void {
  //   let favorites = this.getFavorites();
  //   favorites = favorites.filter(id => id !== movieId);
  //   sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
  // }

  // Check if a movie is favorited

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

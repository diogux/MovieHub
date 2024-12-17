import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  private sessionKey = 'favoriteMovies';
  private baseUrl = environment.baseUrl + 'favorites/toggle';
  private baseFavoritesUrl = environment.baseUrl + 'favorites';

  constructor(private http: HttpClient, private auth: AuthService) {
    auth.is_logged_in();
  }

  getFavorites(): Observable<number[]> {
    return this.http.get<number[]>(this.baseFavoritesUrl, { withCredentials: true });
  }

  addFavorite(movieId: number): void {
    this.http.post(
      this.baseUrl,
      { id: movieId },
      { withCredentials: true }
    ).subscribe();
  }

  isFavorite(movieId: number, favs: number[]): boolean {
    return favs.includes(movieId);
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

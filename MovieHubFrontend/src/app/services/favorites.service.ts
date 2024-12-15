import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

private sessionKey = 'favoriteMovies';

  constructor() {}

  // Fetch favorites (SessionStorage for non-logged-in users)
  getFavorites(): number[] {
    const favorites = sessionStorage.getItem(this.sessionKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  // Add a movie to favorites
  addFavorite(movieId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
    }
  }

  // Remove a movie from favorites
  removeFavorite(movieId: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(id => id !== movieId);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
  }

  // Check if a movie is favorited
  isFavorite(movieId: number): boolean {
    return this.getFavorites().includes(movieId);
  }

  getFavorites_session(): number[] {
    const favorites = sessionStorage.getItem(this.sessionKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite_session(movieId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(movieId)) {
      favorites.push(movieId);
      sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
    }
  }

  removeFavorite_session(movieId: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(id => id !== movieId);
    sessionStorage.setItem(this.sessionKey, JSON.stringify(favorites));
  }

  isFavorite_session(movieId: number): boolean {
    return this.getFavorites().includes(movieId);
  }




}

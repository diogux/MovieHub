import { Component } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {

  isLoggedIn: boolean = false;
  favorites_list: Movie[] = [];

  constructor(private favoritesService: FavoritesService, private auth: AuthService, private movieService: MovieService) { 
    this.isLoggedIn = this.auth.is_logged_in();
    this.get_favorites();
  }

  favorites: number[] = [];

toggleFavorite(movieId: number): void {
  if (this.isLoggedIn) {
    if (this.favorites.includes(movieId)) {
      this.favoritesService.addFavorite(movieId); // Remove favorite
      this.favorites = this.favorites.filter(id => id !== movieId); // Update local array
    } else {
      this.favoritesService.addFavorite(movieId); // Add favorite
      this.favorites.push(movieId); // Update local array
    }
  } else {
    if (this.favoritesService.isFavorite_session(movieId)) {
      this.favoritesService.removeFavorite_session(movieId); // Remove session favorite
    } else {
      this.favoritesService.addFavorite_session(movieId); // Add session favorite
    }
    // Update favorites for session storage
    this.favorites = this.favoritesService.getFavorites_session();
  }
}

  isMovieFavorite(movieId: number): boolean {
    if (this.isLoggedIn) {
      return this.favorites.includes(movieId);
    }
    else{
      return this.favoritesService.isFavorite_session(movieId);
    }
  }

  get_favorites(): void {
    if (this.isLoggedIn) {
      this.favoritesService.getFavorites().subscribe(favorites => {
        this.favorites = favorites;
        const array = Object.values(favorites)[0];
        if (Array.isArray(array)) {
          this.favorites = array;
          this.movieService.getMoviesByIds(array).subscribe(movies => {
            this.favorites_list = movies;
          });
        } else {
          console.error("Expected an array but got:", typeof array);
        }
      });
    } else {

      this.favorites = this.favoritesService.getFavorites_session();

      const array = this.favorites;
      if (Array.isArray(array)) {
          this.favorites = array;
          this.movieService.getMoviesByIds(array).subscribe(movies => {
            this.favorites_list = movies;
          });
        } else {
          console.error("Expected an array but got:", typeof array);
        }
      };
    }
  

}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { FavoritesService } from '../../services/favorites.service';
import { environment } from '../../../environments/environment';
import { Emitters } from '../../emitters/emitters';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css',
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  isLoggedIn: boolean = false;
  authenticated: boolean = false; // Indica se o usuário está autenticado
  userperms: string[] = []; // Armazena as permissões do usuário
  favorites: number[] = [];

  constructor(
    private movieService: MovieService,
    private favoritesService: FavoritesService,
    private http: HttpClient
  ) {
    this.isLoggedIn = this.authenticated;
    this.get_favorites();
  }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe((movies) => {
      this.movies = movies;
      this.loading = false;
    });

    // Carregar permissões do usuário
    this.getUserPermissions();
  }

  getUserPermissions(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;

      if (this.authenticated) {
        this.http
          .get<any>(`${environment.baseUrl}user`, { withCredentials: true })
          .subscribe(
            (res) => {
              this.userperms = res.group_permissions || [];
            },
            (error) => {
              console.error('Error fetching user permissions:', error);
              this.userperms = [];
            }
          );
      }
    });
  }

  get_favorites(): void {
    if (this.isLoggedIn) {
      this.favoritesService.getFavorites().subscribe((favorites) => {
        this.favorites = favorites;
        const array = Object.values(favorites)[0];
        if (Array.isArray(array)) {
          this.favorites = array;
        } else {
          console.error('Expected an array but got:', typeof array);
        }
      });
    } else {
      this.favorites = this.favoritesService.getFavorites_session();
    }
  }

  toggleFavorite(movieId: number): void {
    if (this.isLoggedIn) {
      if (this.favorites.includes(movieId)) {
        this.favoritesService.addFavorite(movieId); // Remove favorite
        this.favorites = this.favorites.filter((id) => id !== movieId); // Update local array
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
    } else {
      return this.favoritesService.isFavorite_session(movieId);
    }
  }
}

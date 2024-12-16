import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { env } from 'process';
import { environment } from '../../../environments/environment';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.css'
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  isLoggedIn: boolean = false;

  constructor(private movieService: MovieService, private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
      this.loading = false;
    });
  }

toggleFavorite(movieId: number): void {
    if (this.isLoggedIn) {

      // Handling with the api


    } else {
      // Use SessionStorage for non-logged-in users
      if (this.favoritesService.isFavorite_session(movieId)) {
        this.favoritesService.removeFavorite_session(movieId);
      } else {
        this.favoritesService.addFavorite_session(movieId);
        console.log("Added to favorites");
      }
    }
  }

  isMovieFavorite(movieId: number): boolean {
    if (this.isLoggedIn) {
      // Check if the movie is favorited by the logged-in user
      return false;
    }
    else{
      return this.favoritesService.isFavorite_session(movieId);
    }
  }

}

import { Component, OnInit, inject } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Emitters } from '../../emitters/emitters';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent {

  movie: Movie | undefined = undefined;
  movieService: MovieService = inject(MovieService);
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  authenticated: boolean = false;
  userperms: string[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private http: HttpClient) {
    this.getUserPermissions();
    this.getMovie();
  }

  getMovie(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.getMovie(id)
      .subscribe(movie => {
        this.movie = movie;
        this.loading = false;
      });
  }

  deleteMovie(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movieService.deleteMovie(id)
      .subscribe(() => {
        this.location.back();
      });
  }

  getUserPermissions(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;

      if (this.authenticated) {
        this.http.get<any>(`${environment.baseUrl}user`, { withCredentials: true }).subscribe(
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
}

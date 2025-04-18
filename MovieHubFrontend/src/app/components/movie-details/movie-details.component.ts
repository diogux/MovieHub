import { Component, OnInit, inject } from '@angular/core';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';



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
  hasPerm: boolean = false;

  constructor(private route: ActivatedRoute, private location: Location, private auth: AuthService) {
    this.hasPerm = this.auth.has_perm("change_movie");
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


}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Genre } from '../../models/genre';
import { GenreService } from '../../services/genre.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-genres-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './genres-list.component.html',
  styleUrls: ['./genres-list.component.css']
})
export class GenresListComponent implements OnInit {
  genres: Genre[] = [];
  loading: boolean = true;
  baseUrl = environment.baseUrl;

  constructor(private genreService: GenreService) { }

  ngOnInit(): void {
    this.genreService.getGenresWithMovies().subscribe(
      (genresWithMovies: Genre[]) => {
        this.genres = genresWithMovies;
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching genres with movies:', error);
        this.loading = false;
      }
    );
  }
}

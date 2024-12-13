import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Genre } from '../../models/genre';
import { GenreService } from '../../services/genre.service';

@Component({
  selector: 'app-genres-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './genres-list.component.html',
  styleUrl: './genres-list.component.css'
})
export class GenresListComponent {
  genres: Genre[] = [];
  loading: boolean = true;
  baseUrl = 'http://localhost:8000/';

  constructor(private genreService : GenreService) { }

  ngOnInit(): void {
    this.genreService.getGenres().subscribe(genres => {
      this.genres = genres;
    });
  }

}

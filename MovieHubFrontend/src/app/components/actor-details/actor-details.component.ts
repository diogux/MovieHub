import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Actor } from '../../models/actor';
import { ActorService } from '../../services/actor.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-actor-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './actor-details.component.html',
  styleUrl: './actor-details.component.css'
})

export class ActorDetailsComponent implements OnInit {
  actor: Actor | undefined = undefined; 
  loading: boolean = true; 
  baseUrl = environment.pictureUrl; 
  private actorService: ActorService = inject(ActorService);
  movies: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getActor();
    this.getMovies();
  }

  getActor(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.actorService.getActor(id).subscribe({
        next: (actor: Actor) => {
          this.actor = actor;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching actor details:', error);
          this.loading = false;
        }
      });
    }
  }

  getMovies(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.actorService.getMovies(id).subscribe({
        next: (movies: Movie[]) => {
          this.movies = movies;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching actor movies:', error);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}

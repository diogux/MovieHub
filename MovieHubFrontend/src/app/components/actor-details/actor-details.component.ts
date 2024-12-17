import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Actor } from '../../models/actor';
import { ActorService } from '../../services/actor.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Movie } from '../../models/movie';
import { AuthService } from '../../services/auth.service';

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
  hasPerm: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthService
  ) {
    this.hasPerm = this.auth.has_perm("change_actor");
  }

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
      this.actorService.getActorMovies(id).subscribe({
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

  onDeleteActor(id: number | undefined): void {
    if (!id) {
      console.error('ID do actor inválido:', id);
      return;
    }
    this.actorService.deleteActor(id).subscribe(
      (response) => {
        console.log('Actor deletado com sucesso:', response);
        this.location.back(); // Redireciona após sucesso
      },
      (error) => {
        console.error('Erro ao deletar actor:', error);
      }
    );
  }
}

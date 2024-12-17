import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Actor } from '../../models/actor';
import { ActorService } from '../../services/actor.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Movie } from '../../models/movie';
import { AuthService } from '../../services/auth.service';
import { Emitters } from '../../emitters/emitters';  // Importando o Emitters

@Component({
  selector: 'app-actor-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.css']
})
export class ActorDetailsComponent implements OnInit {
  actor: Actor | undefined = undefined;
  loading: boolean = true;
  baseUrl = environment.baseUrl;
  private actorService: ActorService = inject(ActorService);
  movies: any;
  userperms: string[] = [];  // Inicializando o array de permissões como vazio
  authenticated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getActor();
    this.getMovies();
    this.getUserPermissions();  // Chama a função para pegar as permissões do usuário
  }

  // Função para buscar as permissões do usuário
  getUserPermissions(): void {
    // Subscribing to the authEmitter to check if user is authenticated
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;

      // Se o usuário estiver autenticado, busca as permissões
      if (this.authenticated) {
        this.http.get<any>(this.baseUrl + 'user', { withCredentials: true }).subscribe(
          (res) => {
            // Extraindo as permissões de grupos
            const groupPermissions = res.group_permissions;
            console.log(groupPermissions);  // Exibe as permissões no console
            // Atribuindo as permissões ao array userperms
            this.userperms = groupPermissions || []; // Se não houver permissões, atribui um array vazio
          },
          (error) => {
            console.error('Error fetching user data:', error);
            this.userperms = []; // Fallback para um array vazio em caso de erro
          }
        );
      }
    });
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

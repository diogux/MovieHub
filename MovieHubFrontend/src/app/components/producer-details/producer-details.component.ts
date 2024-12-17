import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Producer } from '../../models/producer';
import { ProducerService } from '../../services/producer.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Movie } from '../../models/movie';
import { Emitters } from '../../emitters/emitters';

@Component({
  selector: 'app-producer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './producer-details.component.html',
  styleUrl: './producer-details.component.css'
})
export class ProducerDetailsComponent implements OnInit {
  producer: Producer | undefined = undefined;
  movies: Movie[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  userperms: string[] = [];
  authenticated: boolean = false;

  private producerService: ProducerService = inject(ProducerService);
  private http: HttpClient = inject(HttpClient);

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getUserPermissions(); // Carrega permissões do usuário
    this.getProducer();
    this.getMovies();
  }

  // Método para buscar permissões do usuário
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

  onDeleteProducer(id: number | undefined): void {
    if (!id) {
      console.error('ID do produtor inválido:', id);
      return;
    }
    this.producerService.deleteProducer(id).subscribe(
      (response) => {
        console.log('Produtor deletado com sucesso:', response);
        this.location.back(); // Redireciona após sucesso
      },
      (error) => {
        console.error('Erro ao deletar produtor:', error);
      }
    );
  }

  getProducer(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.producerService.getProducer(id).subscribe({
        next: (producer: Producer) => {
          this.producer = producer;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching producer details:', error);
          this.loading = false;
        }
      });
    }
  }

  getMovies(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.producerService.getProducerMovies(id).subscribe({
        next: (movies: Movie[]) => {
          this.movies = movies;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching producer movies:', error);
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}

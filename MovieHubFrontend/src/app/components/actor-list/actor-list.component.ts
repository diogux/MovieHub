import { Component, OnInit, inject } from '@angular/core';
import { Actor } from '../../models/actor';
import { ActorService } from '../../services/actor.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Emitters } from '../../emitters/emitters';

@Component({
  selector: 'app-actor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './actor-list.component.html',
  styleUrl: './actor-list.component.css'
})
export class ActorListComponent implements OnInit {
  actors: Actor[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  searchQuery: string = '';
  userperms: string[] = [];  // Permissões do usuário
  authenticated: boolean = false; // Estado de autenticação

  private http: HttpClient = inject(HttpClient);

  constructor(private actorService: ActorService) {}

  ngOnInit(): void {
    this.getActors();
    this.getUserPermissions(); // Busca as permissões do usuário
  }

  getActors(): void {
    this.actorService.getActors().subscribe(actors => {
      this.actors = actors;
      this.loading = false;
    });
  }

  // Função para buscar as permissões do usuário
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

  onSearch(): void {
    console.log('Search for:', this.searchQuery);
    // Lógica de busca pode ser implementada aqui
  }
}

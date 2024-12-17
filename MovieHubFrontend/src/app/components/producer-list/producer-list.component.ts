import { Component, OnInit } from '@angular/core';
import { Producer } from '../../models/producer';
import { ProducerService } from '../../services/producer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Emitters } from '../../emitters/emitters';

@Component({
  selector: 'app-producer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './producer-list.component.html',
  styleUrl: './producer-list.component.css'
})
export class ProducerListComponent implements OnInit {
  producers: Producer[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  userperms: string[] = [];
  authenticated: boolean = false;

  constructor(
    private producerService: ProducerService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserPermissions(); // Chama o método para carregar permissões do usuário
    this.producerService.getProducers().subscribe((producers) => {
      this.producers = producers;
      this.loading = false;
    });
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
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Producer } from '../../models/producer';
import { ProducerService } from '../../services/producer.service';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-producer-details',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './producer-details.component.html',
  styleUrl: './producer-details.component.css'
})


export class ProducerDetailsComponent implements OnInit {
  producer: Producer | undefined = undefined;
  loading: boolean = true;
  baseUrl = environment.pictureUrl;
  private producerService: ProducerService = inject(ProducerService);
  movies: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location
    ) {
  }

  ngOnInit(): void {
    this.getProducer();
    this.getMovies();
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
      this.producerService.getMovies(id).subscribe({
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Producer } from '../../models/producer';
import { Actor } from '../../models/actor';
import { Genre } from '../../models/genre';
import { ProducerService } from '../../services/producer.service';
import { ActorService } from '../../services/actor.service';
import { GenreService } from '../../services/genre.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.css']
})


export class EditMovieComponent implements OnInit {
  form!: FormGroup; 
  loading: boolean = false;
  producers: Producer[] = [];
  actors: Actor[] = [];
  genres: Genre[] = [];
  movieId: string = '';
  posterPreview: string | null = null; 
  currentPosterUrl: string | null = null; 
  baseUrl = environment.pictureUrl;
  backendUrl = environment.backendUrl;


  constructor(
    private movieService: MovieService,
    private producerService: ProducerService,
    private actorService: ActorService,
    private genreService: GenreService,
    private fb: FormBuilder,
    private http: HttpClient,
    private route : ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [''],
      duration: [''],
      producers: [[]],
      actors: [[]],
      release_date: [''],
      genres: [[]],
      synopsis: [''],
      score: [''],
      likes: [''],
      poster: [null]
    });
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id') || '';
    this.loadMovieData();
    this.loadAdditionalData();
  }

  loadMovieData(): void {
    const movieIdNumber = Number(this.movieId); 
  
    if (isNaN(movieIdNumber)) {
      console.error('ID do filme inválido:', this.movieId);
      return;
    }
  
    this.movieService.getMovie(movieIdNumber).subscribe(
      (data) => {
        this.form.patchValue({
          title: data.title,
          duration: data.duration,
          producers: data.producers.map((p: any) => p.id),
          actors: data.actors.map((a: any) => a.id),
          release_date: data.release_date,
          genres: data.genres.map((g: any) => g.id),
          synopsis: data.synopsis,
          score: data.score,
          likes: data.likes
        });
    
        this.currentPosterUrl = data.poster ? `${this.backendUrl}${data.poster}` : null;

      },
      (error) => console.error('Erro ao carregar filme:', error)
    );
    
  }
  
  onCheckboxChange(event: any, field: string): void {
    const value = +event.target.value; 
    const checked = event.target.checked;
  
    const currentValues = this.form.value[field] || [];
  
    if (checked) {
      this.form.patchValue({
        [field]: [...currentValues, value]
      });
    } else {
      this.form.patchValue({
        [field]: currentValues.filter((id: number) => id !== value)
      });
    }
  }
  

  
  loadAdditionalData(): void {
    this.producerService.getProducers().subscribe(data => this.producers = data);
    this.actorService.getActors().subscribe(data => this.actors = data);
    this.genreService.getGenres().subscribe(data => this.genres = data);
  }

  onPosterChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ poster: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.posterPreview = reader.result as string; 
      };
      reader.readAsDataURL(file);
    }
  }
  
submit(): void {
  const formData = new FormData();

  Object.keys(this.form.value).forEach(key => {
    const value = this.form.value[key];

    if (key === 'poster' && value) {
      
      formData.append('poster', value);
    } else if (Array.isArray(value) && value != null) {
      formData.append(key, `[${value}]`);
    } else if (value) {
      formData.append(key, value);
    }
  });


  this.movieService.editMovie(formData, Number(this.movieId)).subscribe(
    (response) => {
      this.router.navigate(['/movies', this.movieId ]);

    },
    (error) => {
      console.error('Erro ao atualizar filme:', error);
    }
  );
}

  
  
}

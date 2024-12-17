import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { Producer } from '../../models/producer';
import { Actor } from '../../models/actor';
import { Genre } from '../../models/genre';
import { ProducerService } from '../../services/producer.service';
import { ActorService } from '../../services/actor.service';
import { GenreService } from '../../services/genre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-movie',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  form!: FormGroup; // Reactive Form
  loading: boolean = false;
  movies: Movie[] = [];
  producers: Producer[] = [];
  actors: Actor[] = [];
  genres: Genre[] = [];

  constructor(

    private movieService: MovieService,
    private producerService: ProducerService,
    private actorService: ActorService,
    private genreService: GenreService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router


  ) { 
    this.form = this.fb.group({
      title: ['', Validators.required],
      duration: ['', Validators.required],
      producers: [[]], // Inicialmente vazio
      actors: [[]],    // Inicialmente vazio
      release_date: ['', Validators.required],
      genres: [[]],    // Inicialmente vazio
      synopsis: ['', Validators.required],
      score: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
      likes: [0],
      poster: [], 
      
    });
    
  }

  ngOnInit(): void {
    this.loadActors();
    this.loadGenres();
    this.loadProducers();
  } 


  loadActors(): void {
    this.actorService.getActors().subscribe((actors) => this.actors = actors);
  }
  
  loadGenres(): void {
    this.genreService.getGenres().subscribe((genres) => this.genres = genres);
  }
  
  loadProducers(): void {
    this.producerService.getProducers().subscribe((producers) => this.producers = producers);
  }
  
  onCheckboxChange(event: any, field: string): void {
    const value = +event.target.value; // Converte o ID para número
    const checked = event.target.checked;
  
    const currentValues: number[] = this.form.value[field] || [];
  
    if (checked) {
      // Adiciona o ID se estiver selecionado
      this.form.patchValue({
        [field]: [...currentValues, value]
      });
    } else {
      // Remove o ID se estiver desmarcado
      this.form.patchValue({
        [field]: currentValues.filter(id => id !== value)
      });
    }
  }
  



  addMovie(): void {
    if (this.form.invalid) {
      return; // Ensure the form is valid before submission
    }

    this.loading = true;

    // Map form value to Movie object
    const movie: Movie = {
      id: 0, // Assuming the backend will generate the ID
      ...this.form.value,
    };

    this.movieService.addMovie(movie).subscribe({
      next: (movie) => {
        this.loading = false;
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        console.error('Error adding movie:', err);
        this.loading = false;
      }
    });
  }

  posterPreview: string | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.posterPreview = reader.result as string; // Certifica-te de usar 'string' como tipo aqui
      };
      reader.readAsDataURL(file);
    }
  }
  

  private resetForm(): void {
    this.form.reset({
      title: '',
      duration: '',
      producers: [],
      actors: [],
      releaseDate: '',
      genres: [],
      synopsis: '',
      score: 0,
      likes: 0,
      poster: [],
    });
  }

  private loadData(): void {
    this.movieService.getMovies().subscribe((movies) => {
      this.movies = movies;
    });
    this.producerService.getProducers().subscribe((producers) => {
      this.producers = producers;
    });
    this.actorService.getActors().subscribe((actors) => {
      this.actors = actors;
    });
    this.genreService.getGenres().subscribe((genres) => {
      this.genres = genres;
    });

  }

  submit(): void {
    if (this.form.invalid) {
      console.log("Formulário inválido");
      return;
    }
  
    const formData = new FormData();
  
    // Mapear valores para o FormData
    Object.keys(this.form.value).forEach((key) => {
      const value = this.form.value[key];
  
      if (key === 'poster' && value) {
        formData.append('poster', value); // Anexar ficheiro
      } else if (Array.isArray(value)) {
        // Converte arrays em strings compatíveis
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
  
    this.http.post("http://localhost:8000/api/movies/add/", formData, {
      withCredentials: true
    }).subscribe(() => this.router.navigate(['movies']));
  }
  
}

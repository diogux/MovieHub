import { Component, OnInit } from '@angular/core';
import { ProducerService } from '../../services/producer.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
// import { MovieService } from '../../services/movie.service';
// import { Movie } from '../../models/movie';
import { Producer } from '../../models/producer';
import { HttpClient, HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-producer-add',
  templateUrl: './producer-add.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, HttpClientModule, NgFor],
  styleUrls: ['./producer-add.component.css']
})
// export class ProducerAddComponent implements OnInit{
export class ProducerAddComponent{

  producerForm: FormGroup;
  // movies: Movie[] = [];
  producers: Producer[] = [];

  errors: any = {};
  successMessage: string | null = null;

  constructor(
    private producerService: ProducerService,
    private http: HttpClient,
    // private movieService: MovieService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.producerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      date_of_birth: ['', Validators.required],
      date_of_death: [''],
      biography: ['', Validators.maxLength(500)],
      picture: [null],
      // movies: [[]]
    });
  }


  // ngOnInit(): void {
  //   this.loadMovies();
  // }

  // // Fetch the list of movies
  // loadMovies(): void {
  //   this.movieService.getMovies().subscribe((movies) => this.movies = movies);

  // }

  // // Handle checkbox selection for movies
  // onCheckboxChange(event: any): void {
  //   const value = +event.target.value; // Movie ID as a number
  //   const checked = event.target.checked;

  //   const selectedMovies: number[] = this.producerForm.value.movies || [];

  //   if (checked) {
  //     this.producerForm.patchValue({ movies: [...selectedMovies, value] });
  //   } else {
  //     this.producerForm.patchValue({ movies: selectedMovies.filter(id => id !== value) });
  //   }
  // }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.producerForm.patchValue({ picture: file });
    }
  }

  

  
  // addProducer(): void {
  //   if (this.producerForm.invalid) {
  //     return; // Ensure the form is valid before submission
  //   }

  //   // Map form value to Movie object
  //   const producer: Producer = {
  //     id: 0, // Assuming the backend will generate the ID
  //     ...this.producerForm.value,
  //   };

  //   this.producerService.addProducer(producer).subscribe({
  //     next: (movie) => {
  //       this.resetForm();
  //       this.loadData();
  //     },
  //     error: (err) => {
  //       console.error('Error adding movie:', err);
  //     }
  //   });
  // }

  // private resetForm(): void {
  //   this.producerForm.reset({
  //     name: '',
  //     date_of_birth: '',
  //     date_of_death: '',
  //     biography: '',
  //     picture:'',
  //     // movies: []
  //   });
  // }

  // private loadData(): void {
  //   this.producerService.getProducers().subscribe((producers) => {
  //     this.producers = producers;
  //   });
  //   this.movieService.getMovies().subscribe((movies) => {
  //     this.movies = movies;
  //   });

  // }

  submitForm(): void {
    if (this.producerForm.invalid) {
      console.log("Formulário inválido");
      return;
    }

    const formData = new FormData();

    // Mapear valores do formulário para FormData
    Object.keys(this.producerForm.value).forEach(key => {
      const value = this.producerForm.value[key];

      if (key === 'picture' && value) {
        formData.append('picture', value); // Adicionar o ficheiro
      } else if (Array.isArray(value) && value != null ) {
        formData.append(key, JSON.stringify(value)); // Arrays como JSON
      } else if (value) {
        formData.append(key, value); // Outros campos
      }
    });

    // ** Log do conteúdo do FormData usando forEach **
    console.log('Dados enviados para a API:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Enviar para a API via HttpClient
    this.http.post('http://localhost:8000/api/producers/add/', formData, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.successMessage = `Producer added successfully!`;
        this.router.navigate(['/producers']);
      },
      error: (err) => {
        this.errors = err.error || { message: 'Something went wrong!' };
      }
    });
  }
}

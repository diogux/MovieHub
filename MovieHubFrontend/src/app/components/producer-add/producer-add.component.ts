import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Producer } from '../../models/producer';
import { HttpClient, HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-producer-add',
  templateUrl: './producer-add.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, HttpClientModule],
  styleUrls: ['./producer-add.component.css']
})
export class ProducerAddComponent {

  producerForm: FormGroup;
  producers: Producer[] = [];

  errors: any = {};
  successMessage: string | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.producerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      date_of_birth: ['', Validators.required],
      date_of_death: [''],
      biography: ['', Validators.maxLength(500)],
      picture: [null],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.producerForm.patchValue({ picture: file });
    }
  }

  submitForm(): void {
    if (this.producerForm.invalid) {
      console.log("Formulário inválido");
      return;
    }

    const formData = new FormData();

    Object.keys(this.producerForm.value).forEach(key => {
      const value = this.producerForm.value[key];

      if (key === 'picture' && value) {
        formData.append('picture', value);
      } else if (Array.isArray(value) && value != null) {
        formData.append(key, JSON.stringify(value));
      } else if (value) {
        formData.append(key, value);
      }
    });

    console.log('Dados enviados para a API:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

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

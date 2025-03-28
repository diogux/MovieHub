import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-actor-add',
  templateUrl: './actor-add.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  styleUrls: ['./actor-add.component.css']
})
export class ActorAddComponent {
  actorForm: FormGroup;
  successMessage: string | null = null;
  errors: any = {};
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.actorForm = this.fb.group({
      name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      place_of_birth: ['', Validators.required],
      date_of_death: [''],
      biography: ['', Validators.maxLength(500)],
      picture: [null],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.actorForm.patchValue({ picture: file });
    }
  }

  submitForm(): void {
    if (this.actorForm.invalid) {
      this.errors = {message : "Please fill all the required fields!"}
      return;
    }

    const formData = new FormData();

    Object.keys(this.actorForm.value).forEach(key => {
      const value = this.actorForm.value[key];

      if (key === 'picture' && value) {
        formData.append('picture', value); 
      } else if (Array.isArray(value) && value != null ) {
        formData.append(key, JSON.stringify(value)); 
      } else if (value) {
        formData.append(key, value); 
      }
    });

    const url = this.baseUrl + 'actors/add/';
    
    this.http.post(url, formData, {
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.successMessage = `Actor added successfully!`;
        this.router.navigate(['/actors']);
      },
      error: (err) => {
        this.errors = err.error || { message: 'Something went wrong!' };
      }
    });
  }
}

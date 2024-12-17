import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Actor } from '../../models/actor'; // Importe a interface Actor
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-actor-add',
  templateUrl: './actor-add.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  styleUrls: ['./actor-add.component.css']
})
export class ActorAddComponent {
  actorForm: FormGroup;
  successMessage: string | null = null;
  errors: any = {};

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.actorForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      date_of_birth: ['', Validators.required],
      place_of_birth: ['', Validators.required],
      date_of_death: [''],
      biography: ['', Validators.maxLength(500)],
      picture: [null],
    });
  }

  // Método para lidar com mudanças no arquivo de imagem
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.actorForm.patchValue({ picture: file });
    }
  }

  // Método para enviar o formulário
  submitForm(): void {
    if (this.actorForm.invalid) {
      console.log("Formulário inválido");
      return;
    }

    const formData = new FormData();

    // Mapear valores do formulário para FormData
    Object.keys(this.actorForm.value).forEach(key => {
      const value = this.actorForm.value[key];

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
    this.http.post('http://localhost:8000/api/actors/add/', formData, {
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

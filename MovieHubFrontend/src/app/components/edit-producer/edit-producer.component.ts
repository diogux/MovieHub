import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProducerService } from '../../services/producer.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-producer',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-producer.component.html',
  styleUrls: ['./edit-producer.component.css']
})
export class EditProducerComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  producerId: string = '';
  picturePreview: string | null = null; // Pré-visualização da nova imagem
  currentPictureUrl: string | null = null;
  baseUrl = environment.pictureUrl;

  constructor(
    private producerService: ProducerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: [''],
      date_of_birth: [''],
      date_of_death: [''],
      biography: [''],
      picture: [null]
    });
  }

  ngOnInit(): void {
    this.producerId = this.route.snapshot.paramMap.get('id') || '';
    this.loadProducerData();
  }

  loadProducerData(): void {
    const producerIdNumber = Number(this.producerId);

    if (isNaN(producerIdNumber)) {
      console.error('ID do produtor inválido:', this.producerId);
      return;
    }

    this.producerService.getProducer(producerIdNumber).subscribe(
      (data) => {
        this.form.patchValue({
          name: data.name,
          date_of_birth: data.date_of_birth,
          date_of_death: data.date_of_death,
          biography: data.biography
        });

        this.currentPictureUrl = data.picture
          ? `${this.baseUrl}${data.picture}`
          : null;
      },
      (error) => console.error('Erro ao carregar produtor:', error)
    );
  }

  onPictureChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.form.patchValue({ picture: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.picturePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  submit(): void {
    const formData = new FormData();

    // Prepara os dados do formulário para envio
    Object.keys(this.form.value).forEach((key) => {
      const value = this.form.value[key];
      if (key === 'picture' && value) {
        formData.append('picture', value);
      } else if (value) {
        formData.append(key, value);
      }
    });

    // Log do FormData para depuração
    console.log('Dados enviados para a API:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Chama o serviço para editar o produtor
    this.producerService.editProducer(formData, Number(this.producerId)).subscribe(
      (response) => {
        console.log('Produtor atualizado com sucesso:', response);
        this.router.navigate(['/producers', this.producerId]); // Redireciona após sucesso
      },
      (error) => {
        console.error('Erro ao atualizar produtor:', error);
      }
    );
  }
}

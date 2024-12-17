import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActorService } from '../../services/actor.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-actor',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './edit-actor.component.html',
  styleUrls: ['./edit-actor.component.css']
})
export class EditActorComponent implements OnInit {
  form!: FormGroup;
  loading: boolean = false;
  actorId: string = '';
  picturePreview: string | null = null; 
  currentPictureUrl: string | null = null;
  baseUrl = environment.pictureUrl;

  constructor(
    private actorService: ActorService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: [''],
      date_of_birth: [''],
      place_of_birth: [''],
      date_of_death: [''],
      biography: [''],
      picture: [null]
    });
  }

  ngOnInit(): void {
    this.actorId = this.route.snapshot.paramMap.get('id') || '';
    this.loadActorData();
  }

  loadActorData(): void {
    const actorIdNumber = Number(this.actorId);

    if (isNaN(actorIdNumber)) {
      console.error('ID do ator inválido:', this.actorId);
      return;
    }

    this.actorService.getActor(actorIdNumber).subscribe(
      (data) => {
        this.form.patchValue({
          name: data.name,
          date_of_birth: data.date_of_birth,
          place_of_birth: data.place_of_birth,
          date_of_death: data.date_of_death,
          biography: data.biography
        });

        this.currentPictureUrl = data.picture
          ? `${this.baseUrl}${data.picture}`
          : null;
      },
      (error) => console.error('Erro ao carregar ator:', error)
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

    Object.keys(this.form.value).forEach((key) => {
      const value = this.form.value[key];
      if (key === 'picture' && value) {
        formData.append('picture', value);
      } else if (value) {
        formData.append(key, value);
      }
    });


    this.actorService.editActor(formData, Number(this.actorId)).subscribe(
      (response) => {
        this.router.navigate(['/actors', this.actorId]); 
      },
      (error) => {
        console.error('Erro ao atualizar ator:', error);
      }
    );
  }
}

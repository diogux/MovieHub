import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({});
  groupLabels = {
    1: 'Movie Manager',
    2: 'Crew Manager',
    3: 'User'
  };
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      groups: [[], Validators.required]
    });
  }

  submit(): void {
    const formData = this.form.getRawValue();

    const { groups, ...restOfFormData } = formData;

    const groupsArray = Array.isArray(groups) ? groups.map(group => parseInt(group, 10)) : [parseInt(groups, 10)];

    if (groupsArray.length < 1) {
      return;
    }

    const finalData = { ...restOfFormData, groups: groupsArray };

    this.http.post(environment.baseUrl + 'register', finalData)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error('Erro ao enviar dados:', err)
      });
  }
}

import { Component , OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  form: FormGroup = this.formBuilder.group({});
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: '',
      email: '',
      password: '',
      groups:[[3]]
    });
  }

  submit(): void{
    console.log(this.form.getRawValue());
    this.http.post(environment.baseUrl + 'register', this.form.getRawValue(),{
      withCredentials: true
    })
    .subscribe( () => this.router.navigate(['/login']));
  }
}

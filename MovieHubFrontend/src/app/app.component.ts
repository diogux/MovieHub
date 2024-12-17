import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";

import { HttpClient } from '@angular/common/http';
import { Emitters } from './emitters/emitters'
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, NavbarComponent, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'MovieHubFrontend';
  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // baseurl + 'users
    const url = this.baseUrl + 'user';
    this.http.get(url, { withCredentials: true }).subscribe(
      (res: any) => {
        
        Emitters.authEmitter.emit(true);
      },
      err => {
        Emitters.authEmitter.emit(false);
      }
    );
  }




}

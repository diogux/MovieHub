import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // cookie = this.getCookie("jwt")?.toString();
  
  
  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.http.get(environment.baseUrl + 'user', { withCredentials: true }).subscribe(
      (res: any) => {
        
        Emitters.authEmitter.emit(true);
      },
      err => {
        Emitters.authEmitter.emit(false);
      }
    );
  }

  
  // getCookie(name: string): string|null {
  //   const nameLenPlus = (name.length + 1);
  //   return document.cookie
  //     .split(';')
  //     .map(c => c.trim())
  //     .filter(cookie => {
  //       return cookie.substring(0, nameLenPlus) === `${name}=`;
  //     })
  //     .map(cookie => {
  //       return decodeURIComponent(cookie.substring(nameLenPlus));
  //     })[0] || null;
  //   }

}

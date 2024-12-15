import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authenticated = false;
  himessage = '';
  baseUrl = environment.baseUrl;
  constructor(
    private http: HttpClient
  ){}
  ngOnInit(): void {
      Emitters.authEmitter.subscribe(
        (auth: boolean) => {
          this.authenticated = auth;
          if (this.authenticated == true){
            this.http.get(this.baseUrl+ '/user', {withCredentials : true}).subscribe(
              (res : any) => {
                this.himessage = `Hi ${res.username}`;
                console.log(res)
              }
            )
          }
        }
      );
     
  }

}



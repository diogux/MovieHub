import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';


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
  constructor(
    private http: HttpClient
  ){}
  ngOnInit(): void {
      Emitters.authEmitter.subscribe(
        (auth: boolean) => {
          this.authenticated = auth;
          if (this.authenticated == true){
            this.http.get('http://localhost:8000/api/user', {withCredentials : true}).subscribe(
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



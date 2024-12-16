import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';


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
    private http: HttpClient,
    private auth: AuthService
  ){}
  ngOnInit(): void {
    // console.log("nav")
    // if (this.auth.is_logged_in()){
    //   this.himessage = `Hi diogu}`;}
    // else{

    // this.himessage = '';

    // }
      console.log(this.auth.is_logged_in())
      Emitters.authEmitter.subscribe(
        (auth: boolean) => {
          this.authenticated = auth;
          if (this.authenticated == true){
            this.http.get(this.baseUrl+ 'user', {withCredentials : true}).subscribe(
              (res : any) => {
                // this.auth.set_logged_in();
                this.himessage = `Hi ${res.username}`;
                console.log(res)
              }
            )
          }
        }
      );
  }

  logout():void{
    this.http.post(this.baseUrl +'logout', {}, {withCredentials:true})
    .subscribe(()=> this.authenticated = false);
    this.auth.set_logged_out();
  }

}



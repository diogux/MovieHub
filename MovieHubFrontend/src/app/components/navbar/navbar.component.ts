import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Emitters } from '../../emitters/emitters';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';



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
      console.log(this.auth.getUserPermissions())

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
      // let perms = this.getUserPermissions()
      // console.log(perms)
  }

  logout():void{
    this.http.post(this.baseUrl +'logout', {}, {withCredentials:true})
    .subscribe(()=> this.authenticated = false);
    this.auth.set_logged_out();
  }

  getUserPermissions(): void {
    // Subscribing to the authEmitter to check if user is authenticated
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;

      // If authenticated, fetch user data
      if (this.authenticated) {
        this.http.get<any>(this.baseUrl + 'user', { withCredentials: true }).subscribe(
          (res) => {
            // Extraindo as permissões de grupos
            const groupPermissions = res.group_permissions;
            console.log(groupPermissions);  // Exibe as permissões no console
            // Agora podemos fazer algo com as permissões (ex: exibir no frontend)
            return groupPermissions;
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      }
    });
  }


}



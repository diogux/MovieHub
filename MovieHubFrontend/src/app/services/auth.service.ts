import { Injectable } from '@angular/core';
import { Emitters } from '../emitters/emitters';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;

  constructor() {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isLoggedIn = auth;
    });
  }

  getLoginStatus(): boolean {
    // Returns the value of the emitterj
    return this.isLoggedIn;
  }


}

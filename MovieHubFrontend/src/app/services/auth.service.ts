import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart } from '@angular/router'; // Import Router and NavigationStart
import { environment } from '../../environments/environment';
import { Emitters } from '../emitters/emitters';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  private baseUrl: string = environment.baseUrl;
  private cookie = this.getCookie("jwt")
  private registerUrl = this.baseUrl + 'register/';
  private loginUrl = this.baseUrl + 'login/';
  private userUrl = this.baseUrl + 'user'
  private authenticated = false;
  private permissions: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
  }

  is_logged_in(): boolean {
    if (typeof window !== 'undefined') {
      const logged = localStorage.getItem('logged');
      return logged === 'true';
    }
    return false; 
  }

  getUserPermissions(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
      if (this.authenticated) {
        this.http.get<any>(this.baseUrl + 'user', { withCredentials: true }).subscribe(
          (res) => {
            const name = res.username;
            localStorage.setItem('name', name);
            const groupPermissions = res.group_permissions;
            localStorage.setItem('perms', groupPermissions.toString());
            this.permissions = groupPermissions;
            return groupPermissions;
          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      }
    });
  }

  has_perm(perm: string): boolean {
    if (localStorage.getItem('perms')  ) {
      const perms = localStorage.getItem('perms');
      return perms ? perms.includes(perm) : false;
    }

      if (localStorage.getItem('name') === 'admin') {
        return true;
      }
    return false;
    }


  set_logged_in(): void {
    localStorage.setItem('logged', 'true');
    this.authenticated = true;
    this.getCookie("jwt");
  }

  set_logged_out(): void {
    localStorage.setItem('logged', 'false');
    this.authenticated = false;
    localStorage.removeItem('perms');
    localStorage.removeItem('name');
    this.setCookie("jwt", "", -1);
    this.getCookie("jwt");
  }

  setCookie(name: string, value: string, days: number): void {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ""}${expires}; path=/`;
  }

  getCookie(cookieName: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${cookieName}=`);

      if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
      }
    }

    return null;
  }

  login(formData: FormData): void {
    this.http.post(this.loginUrl, formData, { withCredentials: true })
      .pipe(
        tap((response: any) => {

          this.authenticated = true;
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  logout(): void {
    this.http.post(this.baseUrl + 'logout', {}, { withCredentials: true })
      .subscribe(() => this.authenticated = false);
  }

  register(formData: FormData): void {
    this.http.post(this.registerUrl, formData)
      .subscribe(() => this.router.navigate(['/login']));
  }

  isAuthenticated(): Observable<boolean> {
    const cookie = document.cookie;
    if (!cookie) {
      return new Observable<boolean>((observer) => observer.next(false));
    }

    return new Observable<boolean>((observer) => {
      this.http.get(this.userUrl, { withCredentials: true }).subscribe(
        (res: any) => {
          observer.next(true);
        },
        (err) => {
          observer.next(false);
        }
      );
    });
  }


}
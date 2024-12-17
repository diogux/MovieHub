import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError, of } from 'rxjs';
import { User } from '../models/user';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationStart } from '@angular/router'; // Import Router and NavigationStart
import { environment } from '../../environments/environment';

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

  constructor(
    private http: HttpClient,
    private router: Router, 
    @Inject (PLATFORM_ID) private platformId: object
  ){
  }

  is_logged_in(): boolean {
    if (typeof window !== 'undefined') {
      const logged = localStorage.getItem('logged');
      return logged === 'true';
    }
    return false; // Default to not logged in if no localStorage
  }


  set_logged_in(): void {
    localStorage.setItem('logged', 'true');
    this.authenticated = true;
    console.log("cookie:"+this.getCookie("jwt"));
  }

  set_logged_out(): void {
    localStorage.setItem('logged', 'false');
    this.authenticated = false;
    // remove the cookie
    this.setCookie("jwt", "", -1);
    console.log("cookie:"+this.getCookie("jwt"));
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


  //   @Inject(PLATFORM_ID) private platformId: object
  // ) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.loadUserFromToken();

  //     // Listen to router events to refresh token on navigation
  //     this.router.events.subscribe((event) => {
  //       if (event instanceof NavigationStart) {
  //         this.refreshTokenIfNecessary();
  //       }
  //     });
  //   }
  // }


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

  // login(username: string, password: string): Observable<any> {
  //   return this.http.post(this.loginUrl, { username, password }).pipe(
  //     tap((response: any) => {
  //       if (!response.access || !response.refresh) {
  //         throw new Error('Missing tokens in the response');
  //       }

  //       const user: User = {
  //         id: response.id || 0,
  //         username: response.username,
  //         groups: response.groups
  //       };

  //       this.userSubject.next(user);
  //     }),
  //     catchError((error) => {
  //       console.error('Login failed:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // login(formData: FormData): void {
  //   this.http.post(this.loginUrl, formData, {
  //     withCredentials: true
  //   })
  //     .subscribe(() =>
  //       this.router.navigate(['/']));
  // }

  login(formData: FormData): void {
    this.http.post(this.loginUrl, formData, { withCredentials: true })
      .pipe(
        tap((response: any) => {

          this.authenticated = true;
          // if (!response.id || !response.username || !response.groups) {
          //   throw new Error('Missing user data in the response');
          // }
  
          // // Construir o objeto do usuário
          // const user: User = {
          //   id: response.id,
          //   username: response.username,
          //   groups: response.groups
          // };
  
          // // Atualizar o estado do usuário
          // this.userSubject.next(user);
  
          // // Inserir no localStorage
          // localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        // Navegar após o login
        this.router.navigate(['/']);
      });
  }
  

  // loadUserFromToken(): void {
  //   if (!isPlatformBrowser(this.platformId)) {
  //     return;
  //   }




  //   this.http.post(this.validateTokenUrl,  { token }).subscribe({
  //     next: (response: any) => {
  //       const user: User = {
  //         id: response.id || 0,
  //         username: response.username,
  //         user_type: response.user_type,
  //         name: response.name,
  //         email: response.email,
  //               };

  //       this.userSubject.next(user);
  //     },
  //     error: (error) => {
  //       if (error.status === 401) {
  //       } else {
  //         this.logout();
  //       }
  //     },
  //   });
  // }

  logout(): void {
    this.http.post(this.baseUrl + 'logout', {}, { withCredentials: true })
      .subscribe(() => this.authenticated = false);
  }


  // register(formData: FormData): Observable<any> {
  //   return this.http.post(this.registerUrl, formData).pipe(
  //     tap((response: any) => {
  //       console.log('Register response:', response);

  //       if (response.access && response.refresh) {
  //         localStorage.setItem('accessToken', response.access);
  //         localStorage.setItem('refreshToken', response.refresh);

  //         const user: User = {
  //           id: response.id,
  //           username: response.username,
  //           user_type: response.user_type,
  //           number_of_purchases: 0,
  //           firstname: response.firstname,
  //           lastname: response.lastname,
  //           address: response.address,
  //           email: response.email,
  //           phone: response.phone,
  //           country: response.country,
  //           balance: 0 // Set the balance to 0 for new users
  //         };

  //         this.userSubject.next(user); 
  //         console.log('User registered and logged in:', user);
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Registration failed:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }


  register(formData: FormData): void {
    console.log(formData);
    this.http.post(this.registerUrl, formData)
      .subscribe(() => this.router.navigate(['/login']));
  }

  isAuthenticated(): Observable<boolean> {
    const cookie = document.cookie;  // Or wherever you're storing the cookie
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

  



  // getUserIdFromLocalStorage(): number | null {
  //   const cookie = this.cookie;
  //   if (!cookie) {
  //     return null;
  //   }
  //   const user = localStorage.getItem("user"); 
  //   if (user) {
  //     try {
  //       const parsedUser = JSON.parse(user) as { id: string }; 
  //       return parseInt(parsedUser.id); 
  //     } catch (error) {
  //       console.error("Error parsing user from localStorage:", error);
  //       return null; 
  //     }
  //   }
  //   return null;
  // }

  getUserIdWithCookie(): number | null {
    const cookie = this.getCookie("jwt");
    if (!cookie) {
      return null;
    }
    this.http.get(this.userUrl, { withCredentials: true }).subscribe(
      (res: any) => {
        
        return parseInt(res.id)? parseInt(res.id) : null;
      },
      err => {
        return null;
      }
    );
    return null;
  }



  // isto acho q n vamos usar sequer mas n faz mal nenhum aqui ekekekeke

  updateUser(updatedUser: Partial<User>): void {
    const currentUser = this.userSubject.value; // Obtem o usuário atual
    if (!currentUser) return; // Se o usuário não estiver autenticado, não faz nada

    // Atualiza apenas os campos modificados
    const newUser: User = { ...currentUser, ...updatedUser };

    this.userSubject.next(newUser); // Notifica os observadores sobre a atualização
  }

  //  kekekeke 0% sio

  getUserInfo(): Observable<User> {
    const userString = localStorage.getItem('user');
  
    if (!userString) {
      console.error('No user data found in localStorage');
      return throwError(() => new Error('No user data found in localStorage'));
    }
  
    try {
      const user: User = JSON.parse(userString);
      console.log('User info from localStorage:', user);
  
      this.userSubject.next(user);
  
      return of(user);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return throwError(() => new Error('Invalid user data in localStorage'));
    }
  }
  

  // getUserInfo(): Observable<User> {
  //   const url = `${this.baseUrl}/user/`; // Endpoint URL
  //   const accessToken = localStorage.getItem('accessToken');

  //   if (!accessToken) {
  //     console.error('No access token found');
  //     return throwError(() => new Error('No access token found'));
  //   }

  //   const headers = { Authorization: `Bearer ${accessToken}` };

  //   return this.http.get<User>(url, { headers }).pipe(
  //     tap((user) => {
  //       console.log('User info:', user);
  //       this.userSubject.next(user);
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching user info:', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }



}
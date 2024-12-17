import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.is_logged_in()) {
    const url = state.url;
    const p_movie = authService.has_perm('add_movie');
    const p_actor = authService.has_perm('add_actor');
    const p_producer = authService.has_perm('add_producer');
    const p_edit_movie = authService.has_perm('change_movie');
    const p_edit_actor = authService.has_perm('change_actor');
    const p_edit_producer = authService.has_perm('change_producer');

    switch (url) {
      case '/add-movie':
        if (p_movie) {
          return true;
        }
        break;
      case '/add-actor':
        if (p_actor) {
          return true;
        }
        break;
      case '/add-producer':
        if (p_producer) {
          return true;
        }
        break;
      case '/edit-movie':
        if (p_edit_movie) {
          return true;
        }
        break;
      case '/edit-actor':
        if (p_edit_actor) {
          return true;
        }
        break;
      case '/edit-producer':
        if (p_edit_producer) {
          return true;
        }
        break;
      default:
        return true;
    }



    return true;
  } else {

    router.navigate(['/login']);
    return false;
  }
};

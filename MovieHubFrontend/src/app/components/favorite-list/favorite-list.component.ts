import { Component } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {

  isLoggedIn: boolean = false;

  constructor(private favoritesService: FavoritesService, private auth: AuthService) { 
    console.log("Logged In: "+this.auth.is_logged_in())
    this.isLoggedIn = this.auth.is_logged_in();
    this.get_favorites();
  }

  favorites: number[] = [];

  get_favorites(): void {
    if (this.isLoggedIn) {
      this.favoritesService.getFavorites().subscribe(favorites => {
        this.favorites = favorites;
        console.log(favorites)
        const array = Object.values(favorites)[0];
        if (Array.isArray(array)) {
          console.log(array.length);
          this.favorites = array;
        } else {
          console.error("Expected an array but got:", typeof array);
        }
      });
    } else {

      this.favorites = this.favoritesService.getFavorites_session();
      };
    }
  

}

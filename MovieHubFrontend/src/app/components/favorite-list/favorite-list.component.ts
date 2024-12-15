import { Component } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent {

  isLoggedIn: boolean = false;

  constructor(private favoritesService: FavoritesService) { }

  get_favorites(): number[] {
    if (this.isLoggedIn) {
      // Fetch favorites from the API
      return [];
    }
    else{
      return this.favoritesService.getFavorites_session();
    }
  }

}

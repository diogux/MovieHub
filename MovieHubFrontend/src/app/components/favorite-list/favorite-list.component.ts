import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Emitters } from '../../emitters/emitters';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.css'
})
export class FavoriteListComponent implements OnInit{

  isLoggedIn: boolean = false;
  number_of_favorites: number[] = [];
  favoriteNumbers: number[] = [];


constructor(private favoritesService: FavoritesService) {
  Emitters.authEmitter.subscribe((auth: boolean) => {
    this.handleAuthChange(auth);
  });
}

private handleAuthChange(auth: boolean): void {
  this.isLoggedIn = auth;
  
  if (this.isLoggedIn) {
      this.get_favorites_api().subscribe(favorites => {
        this.favoriteNumbers = favorites;  // Store the list of numbers in the variable
        console.log(this.favoriteNumbers); // Optionally, log the list
      });
  } else {
    this.favoriteNumbers = this.get_favorites_session();
    console.log(this.favoriteNumbers);
  }
}

  ngOnInit(): void {
    this.handleAuthChange(this.isLoggedIn);
  }



  get_favorites_api(): Observable<number[]> {
    return this.favoritesService.getFavorites();
  }

  get_favorites_session(): number[] {
    return this.favoritesService.getFavorites_session();
  }



}

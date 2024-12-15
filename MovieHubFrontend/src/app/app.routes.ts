import { Routes } from '@angular/router';
import { ProducerListComponent } from './components/producer-list/producer-list.component';
import { HomeComponent } from './components/home/home.component';
import { ActorListComponent } from './components/actor-list/actor-list.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { GenresListComponent } from './components/genres-list/genres-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ActorDetailsComponent } from './components/actor-details/actor-details.component';
import { ProducerDetailsComponent } from './components/producer-details/producer-details.component';
import { FavoriteListComponent } from './components/favorite-list/favorite-list.component';


export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'producers', component: ProducerListComponent },
{ path: 'producers/:id', component: ProducerDetailsComponent },

{ path: 'actors', component: ActorListComponent },
{ path: 'actors/:id', component: ActorDetailsComponent },

{ path: 'movies/:id', component: MovieDetailsComponent },
{ path: 'movies', component: MovieListComponent },

    
{ path: 'genres', component: GenresListComponent },
{ path: 'login', component: LoginComponent},
{ path: 'register', component: RegisterComponent},


// Favorite
{ path: 'favorites', component: FavoriteListComponent },

];

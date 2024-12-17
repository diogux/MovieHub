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
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { EditMovieComponent } from './components/edit-movie/edit-movie.component';
import { ProducerAddComponent } from './components/producer-add/producer-add.component'
import { ActorAddComponent } from './components/actor-add/actor-add.component';
import { EditActorComponent } from './components/edit-actor/edit-actor.component';


export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'producers', component: ProducerListComponent },
{ path: 'producers/add', component: ProducerAddComponent},
{ path: 'producers/:id', component: ProducerDetailsComponent },

{ path: 'actors', component: ActorListComponent },
{ path: 'actors/add', component: ActorAddComponent},
{ path: 'actors/:id', component: ActorDetailsComponent },
{ path: 'actors/:id/edit', component: EditActorComponent },

{ path: 'movies/add', component: AddMovieComponent },
{ path: 'movies/:id', component: MovieDetailsComponent },
{ path: 'movies', component: MovieListComponent },
{ path: 'movies/:id/edit', component: EditMovieComponent },


    
{ path: 'genres', component: GenresListComponent },
{ path: 'login', component: LoginComponent},
{ path: 'register', component: RegisterComponent},


// Favorite
{ path: 'favorites', component: FavoriteListComponent },

];

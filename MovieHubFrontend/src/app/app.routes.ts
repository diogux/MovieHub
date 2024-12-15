import { Routes } from '@angular/router';
import { ProducerListComponent } from './components/producer-list/producer-list.component';
import { HomeComponent } from './components/home/home.component';
import { ActorListComponent } from './components/actor-list/actor-list.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { GenresListComponent } from './components/genres-list/genres-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'producers', component: ProducerListComponent },
{ path: 'actors', component: ActorListComponent },
{ path: 'movies/:id', component: MovieDetailsComponent },
{ path: 'movies', component: MovieListComponent },
{ path: 'genres', component: GenresListComponent },
{ path: 'login', component: LoginComponent},
{ path: 'register', component: RegisterComponent}

];

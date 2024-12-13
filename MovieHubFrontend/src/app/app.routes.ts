import { Routes } from '@angular/router';
import { ProducerListComponent } from './components/producer-list/producer-list.component';
import { HomeComponent } from './components/home/home.component';
import { ActorListComponent } from './components/actor-list/actor-list.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';

export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'producers', component: ProducerListComponent },
{ path: 'actors', component: ActorListComponent },
{ path: 'movies', component: MovieListComponent },

];

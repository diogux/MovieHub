import { Component, OnInit } from '@angular/core';
import { Actor } from '../../models/actor';
import { ActorService } from '../../services/actor.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-actor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './actor-list.component.html',
  styleUrl: './actor-list.component.css'
})
export class ActorListComponent implements OnInit {

  actors: Actor[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;



  constructor(private actorService: ActorService) { }

  ngOnInit(): void {
    this.actorService.getActors().subscribe(actors => {
      this.actors = actors;
      this.loading = false;
    });
  }

}

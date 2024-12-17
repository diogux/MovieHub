import { Component, OnInit} from '@angular/core';
import { Producer } from '../../models/producer';
import { ProducerService } from '../../services/producer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-producer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './producer-list.component.html',
  styleUrl: './producer-list.component.css'
})
export class ProducerListComponent implements OnInit {

  producers: Producer[] = [];
  loading: boolean = true;
  baseUrl = environment.pictureUrl;  
  hasPerm: boolean = false;


  constructor(private producerService: ProducerService, private auth: AuthService) { 

    this.hasPerm = this.auth.has_perm("add_actor");
  }

  ngOnInit(): void {
    this.producerService.getProducers().subscribe(producers => {
      this.producers = producers;
      this.loading = false;
    });
  }
}

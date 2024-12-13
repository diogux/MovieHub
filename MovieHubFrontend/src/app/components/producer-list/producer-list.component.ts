import { Component, OnInit} from '@angular/core';
import { Producer } from '../../models/producer';
import { ProducerService } from '../../services/producer.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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
  baseUrl = 'http://localhost:8000/';

  constructor(private producerService: ProducerService) { }

  ngOnInit(): void {
    this.producerService.getProducers().subscribe(producers => {
      this.producers = producers;
      this.loading = false;
    });
  }
}

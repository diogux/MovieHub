import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producer } from '../models/producer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {
  private baseUrl = 'http://localhost:8000/api/producers';

  constructor(private http: HttpClient) { }

  getProducers(): Observable<Producer[]> {
    return this.http.get<Producer[]>(this.baseUrl);
  }
}

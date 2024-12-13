import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producer } from '../models/producer';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {
  private baseUrl = environment.baseUrl + 'producers';

  constructor(private http: HttpClient) { }

  getProducers(): Observable<Producer[]> {
    return this.http.get<Producer[]>(this.baseUrl);
  }
}

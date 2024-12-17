import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producer } from '../models/producer';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {
  private baseUrl = environment.baseUrl + 'producers';

  constructor(private http: HttpClient) { }

  getProducers(): Observable<Producer[]> {
    return this.http.get<Producer[]>(this.baseUrl);
  }

  getProducer(id: number): Observable<Producer> {
    return this.http.get<Producer>(`${this.baseUrl}/${id}`);
  }

  getProducerMovies(id: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/${id}/movies`);
  }

  addProducer(producer: Producer): Observable<Producer>{
    return this.http.post<Producer>(this.baseUrl + '/add', producer, {withCredentials: true});
  }

  editProducer(formData: FormData, producerId: number): Observable<any>{
    return this.http.put(`${this.baseUrl}/edit/${producerId}`, formData,{withCredentials:true});
  }

  deleteProducer(producerId: number): Observable<Producer>{
    return this.http.delete<Producer>(`${this.baseUrl}/delete/${producerId}`,{withCredentials:true});
  }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Person {
  private url: string = 'http://localhost:3000/personas';

  constructor(private readonly http: HttpClient) { }

  getAllPersons(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getPersonById(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  createPerson(person: any): Observable<any> {
    return this.http.post<any>(this.url, person);
  }

  updatePerson(id: number, person: any): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, person);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${id}`);
  }

}

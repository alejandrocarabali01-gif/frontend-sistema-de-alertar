import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Asignatura, AsignaturaCreate } from '../../shared/models/asignatura.model';

@Injectable({ providedIn: 'root' })
export class AsignaturaService {
  private readonly API = '/api/v1/asignaturas';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(`${this.API}/`).pipe(catchError(e => throwError(() => e)));
  }

  create(data: AsignaturaCreate): Observable<Asignatura> {
    return this.http.post<Asignatura>(`${this.API}/`, data).pipe(catchError(e => throwError(() => e)));
  }
}
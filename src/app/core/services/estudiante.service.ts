import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Estudiante, EstudianteCreate } from '../../shared/models/estudiante.model';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private readonly API = '/api/v1/estudiantes';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.API}/`).pipe(catchError(e => throwError(() => e)));
  }

  create(data: EstudianteCreate): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.API}/`, data).pipe(catchError(e => throwError(() => e)));
  }

  getMePerfil(): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.API}/me`).pipe(catchError(e => throwError(() => e)));
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Alerta } from '../../shared/models/alerta.model';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private readonly API = '/api/v1/alertas';
  constructor(private http: HttpClient) {}

  getDocente(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.API}/docente`).pipe(catchError(e => throwError(() => e)));
  }

  getEstudiante(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.API}/estudiante`).pipe(catchError(e => throwError(() => e)));
  }

  getAdmin(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.API}/admin`).pipe(catchError(e => throwError(() => e)));
  }
}
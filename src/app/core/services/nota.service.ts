import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Matricula } from '../../shared/models/matricula.model';

@Injectable({ providedIn: 'root' })
export class NotaService {
  private readonly API = '/api/v1/notas';
  constructor(private http: HttpClient) {}

  getByAsignatura(asignaturaId: string): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(`${this.API}/asignatura/${asignaturaId}`).pipe(catchError(e => throwError(() => e)));
  }

  updateNota(matriculaId: string, notas: Partial<{nota_corte1: number; nota_corte2: number; nota_corte3: number}>): Observable<any> {
    return this.http.patch(`${this.API}/matricula/${matriculaId}`, notas).pipe(catchError(e => throwError(() => e)));
  }

  matricular(estudianteId: string, asignaturaId: string): Observable<Matricula> {
    return this.http.post<Matricula>(`${this.API}/matricular/${estudianteId}/${asignaturaId}`, {}).pipe(catchError(e => throwError(() => e)));
  }
}
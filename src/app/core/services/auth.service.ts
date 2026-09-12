import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { LoginRequest, AuthResponse, User } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/api/v1/auth';
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  get currentUser(): User | null { return this.userSubject.value; }
  get token(): string | null { return this.currentUser?.token ?? null; }
  get isAuthenticated(): boolean { return !!this.token; }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, data).pipe(
      tap(res => {
        const user: User = { nombre: res.nombre, rol: res.rol, user_id: res.user_id, token: res.access_token };
        localStorage.setItem('uc_user', JSON.stringify(user));
        this.userSubject.next(user);
      }),
      catchError(err => throwError(() => err))
    );
  }

  logout(): void {
    localStorage.removeItem('uc_user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private loadUser(): User | null {
    try { return JSON.parse(localStorage.getItem('uc_user') || 'null'); }
    catch { return null; }
  }
}
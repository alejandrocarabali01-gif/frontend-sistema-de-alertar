import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="login-page">
  <div class="login-card">
    <div class="login-header">
      <div class="login-badge">
  <img src="assets/images/logo-unicatolica.png"
       alt="Logo Unicatólica"
       class="login-logo">
</div>
      <h1>Sistema de Alertas Académicas</h1>
      <p>Fundación Universitaria Católica Lumen Gentium</p>
    </div>
    <div class="login-body">
      <div class="alert alert-error" *ngIf="error">⚠️ {{error}}</div>
      <div class="form-group">
        <label>Correo institucional</label>
        <input class="form-control" type="email" [(ngModel)]="email"
          placeholder="usuario@unicatolica.edu.co" (keyup.enter)="login()" />
      </div>
      <div class="form-group" style="margin-bottom:1.25rem">
        <label>Contraseña</label>
        <input class="form-control" type="password" [(ngModel)]="password"
          placeholder="••••••••" (keyup.enter)="login()" />
      </div>
      <button class="btn btn-primary w-full"
        style="justify-content:center;padding:.7rem;font-size:.95rem"
        (click)="login()" [disabled]="loading">
        {{loading ? 'Verificando...' : 'Ingresar al sistema'}}
      </button>
      <hr class="login-divider">
      <p class="login-footer-text">Cali, Colombia · SNIES 2731</p>
    </div>
  </div>
</div>
  `,
styles:  [`
    .login-page{
      min-height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;

      background-image:
        linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)),
        url('/assets/images/unicatolica-bg.jpg');

      background-size:cover;
      background-position:center;
      background-repeat:no-repeat;
    }

    .login-card{
      width:480px;
      border-radius:20px;
      overflow:hidden;
      box-shadow:0 10px 30px rgba(0,0,0,.35);
    }
  `
    ]
  })
export class LoginComponent {
  email = ''; password = ''; error = ''; loading = false;
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.email || !this.password) { this.error = 'Completa todos los campos'; return; }
    this.loading = true; this.error = '';
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: res => {
        this.loading = false;
        if (res.rol === 'estudiante') this.router.navigate(['/mis-alertas']);
        else this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.error = err.status === 401 ? 'Correo o contraseña incorrectos' : 'Error de conexión';
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../models/auth.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
<div class="layout">
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-logo">
    <div class="brand-icon">
      <img src="assets/images/logo-unicatolica.png" alt="UNICATÓLICA">
    </div>
        <div class="brand-text">
          <strong>UNICATÓLICA</strong>
          <small>Lumen Gentium</small>
        </div>
      </div>
      <div class="user-chip">
        <div class="user-avatar">{{user?.nombre?.charAt(0)}}</div>
        <div>
          <div class="user-name">{{user?.nombre}}</div>
          <span class="user-role">{{user?.rol}}</span>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <ng-container *ngIf="user?.rol === 'admin'">
        <div class="nav-section">Principal</div>
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <span class="nav-icon">📊</span> Dashboard
        </a>
        <div class="nav-section">Gestión</div>
        <a routerLink="/estudiantes" routerLinkActive="active">
          <span class="nav-icon">👥</span> Estudiantes
        </a>
        <a routerLink="/docentes" routerLinkActive="active">
          <span class="nav-icon">👨‍🏫</span> Docentes
        </a>
        <a routerLink="/asignaturas" routerLinkActive="active">
          <span class="nav-icon">📚</span> Asignaturas
        </a>
        <div class="nav-section">Reportes</div>
        <a routerLink="/admin" routerLinkActive="active">
          <span class="nav-icon">⚙️</span> Panel admin
        </a>
      </ng-container>

      <ng-container *ngIf="user?.rol === 'docente'">
        <div class="nav-section">Principal</div>
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
          <span class="nav-icon">📊</span> Dashboard
        </a>
        <a routerLink="/notas" routerLinkActive="active">
          <span class="nav-icon">📝</span> Ingresar notas
        </a>
      </ng-container>

      <ng-container *ngIf="user?.rol === 'estudiante'">
        <div class="nav-section">Mi estado académico</div>
        <a routerLink="/mis-alertas" routerLinkActive="active">
          <span class="nav-icon">🔔</span> Mis alertas
        </a>
      </ng-container>
    </nav>

    <div class="sidebar-footer">
      <button class="btn-logout" (click)="logout()">
        <span class="nav-icon"> ⬅ </span> Cerrar sesión
      </button>
    </div>
  </aside>

  <div class="main-content">
    <router-outlet />
  </div>
</div>
  `
})
export class LayoutComponent implements OnInit {
  user: User | null = null;
  constructor(private auth: AuthService) {}
  ngOnInit() { this.auth.user$.subscribe(u => this.user = u); }
  logout() { this.auth.logout(); }
}
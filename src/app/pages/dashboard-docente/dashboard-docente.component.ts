import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertaService } from '../../core/services/alerta.service';
import { AuthService } from '../../core/services/auth.service';
import { Alerta } from '../../shared/models/alerta.model';

@Component({
  selector: 'app-dashboard-docente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="topbar">
  <div>
    <div class="topbar-title">Dashboard</div>
    <div class="topbar-sub">Bienvenido, {{nombre}} — resumen de alertas académicas</div>
  </div>
  <span class="topbar-badge" *ngIf="alertas.length > 0">{{alertas.length}} alertas activas</span>
</div>
<div class="page-body">
  <div class="loading-state" *ngIf="loading"><div class="spinner"></div> Cargando...</div>
  <ng-container *ngIf="!loading">
    <div class="stats-grid">
      <div class="stat-card danger">
        <div class="stat-icon">🔴</div>
        <div><div class="stat-number">{{rojos}}</div><div class="stat-label">Riesgo alto</div></div>
      </div>
      <div class="stat-card warning">
        <div class="stat-icon">🟡</div>
        <div><div class="stat-number">{{amarillos}}</div><div class="stat-label">Riesgo moderado</div></div>
      </div>
      <div class="stat-card primary">
        <div class="stat-icon">📋</div>
        <div><div class="stat-number">{{alertas.length}}</div><div class="stat-label">Total alertas</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">Estudiantes en riesgo</span>
        <a routerLink="/notas" class="btn btn-gold btn-sm">+ Ingresar notas</a>
      </div>
      <div class="card-body" style="padding:0">
        <div class="empty-state" *ngIf="alertas.length === 0">
          <span class="empty-icon">✅</span>
          <p>No hay alertas activas. ¡Todos los estudiantes van bien!</p>
        </div>
        <div class="table-wrapper" *ngIf="alertas.length > 0">
          <table>
            <thead>
              <tr>
                <th>Estudiante</th><th>Código</th><th>Asignatura</th>
                <th>Corte</th><th>Nota actual</th><th>Mín. requerido</th><th>Nivel</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of alertas">
                <td><strong>{{a.estudiante_nombre}}</strong></td>
                <td class="text-muted text-sm" style="font-family:monospace">{{a.estudiante_codigo}}</td>
                <td>{{a.asignatura_nombre}}</td>
                <td><span class="badge badge-blue">Corte {{a.corte}}</span></td>
                <td><strong>{{a.nota_actual?.toFixed(1) ?? '—'}}</strong></td>
                <td>{{a.minimo_requerido != null ? a.minimo_requerido.toFixed(1) : '—'}}</td>
                <td><span class="badge badge-{{a.nivel}}">{{a.nivel}}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


  `
})
export class DashboardDocenteComponent implements OnInit {
  alertas: Alerta[] = [];
  loading = true;
  nombre = '';
  get rojos() { return this.alertas.filter(a => a.nivel === 'rojo').length; }
  get amarillos() { return this.alertas.filter(a => a.nivel === 'amarillo').length; }

  constructor(private svc: AlertaService, private auth: AuthService) {}

  ngOnInit() {
    this.nombre = this.auth.currentUser?.nombre ?? '';
    const rol = this.auth.currentUser?.rol;
    const obs = rol === 'admin' ? this.svc.getAdmin() : this.svc.getDocente();
    obs.subscribe({
      next: d => { this.alertas = d; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertaService } from '../../core/services/alerta.service';
import { Alerta } from '../../shared/models/alerta.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="topbar">
  <div class="topbar-title">Panel Administración</div>
</div>
<div class="page-body">
  <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
  <ng-container *ngIf="!loading">
    <div class="stats-grid">
      <div class="stat-card rojo"><div class="stat-icon">🔴</div><div><div class="stat-number">{{rojos}}</div><div class="stat-label">Alertas rojas</div></div></div>
      <div class="stat-card amarillo"><div class="stat-icon">🟡</div><div><div class="stat-number">{{amarillos}}</div><div class="stat-label">Alertas amarillas</div></div></div>
      <div class="stat-card azul"><div class="stat-icon">📋</div><div><div class="stat-number">{{alertas.length}}</div><div class="stat-label">Total activas</div></div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Todas las alertas activas</span></div>
      <div class="card-body" style="padding:0">
        <div class="table-wrapper">
          <table>
            <thead><tr><th>Matrícula</th><th>Corte</th><th>Nivel</th><th>Nota</th><th>Mín. req.</th><th>Fecha</th></tr></thead>
            <tbody>
              <tr *ngFor="let a of alertas">
                <td class="text-sm" style="font-family:monospace">{{a.matricula_id.slice(0,8)}}...</td>
                <td>Corte {{a.corte}}</td>
                <td><span class="badge badge-{{a.nivel}}">{{a.nivel}}</span></td>
                <td>{{a.nota_actual?.toFixed(1) ?? '—'}}</td>
                <td>{{a.minimo_requerido?.toFixed(1) ?? '—'}}</td>
                <td class="text-sm text-muted">{{a.creada_en | date:'dd/MM/yyyy'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </ng-container>
</div>
  `
})
export class AdminComponent implements OnInit {
  alertas: Alerta[] = []; loading = true;
  get rojos() { return this.alertas.filter(a => a.nivel === 'rojo').length; }
  get amarillos() { return this.alertas.filter(a => a.nivel === 'amarillo').length; }
  constructor(private svc: AlertaService) {}
  ngOnInit() {
    this.svc.getAdmin().subscribe({ next: d => { this.alertas = d; this.loading = false; }, error: () => this.loading = false });
  }
}
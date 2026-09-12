import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertaService } from '../../core/services/alerta.service';
import { AuthService } from '../../core/services/auth.service';
import { Alerta } from '../../shared/models/alerta.model';

@Component({
  selector: 'app-dashboard-estudiante',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="topbar">
  <div>
    <div class="topbar-title">Mis Alertas Académicas</div>
    <div class="topbar-sub">Hola {{nombre}}, revisa el estado de tus asignaturas</div>
  </div>
</div>
<div class="page-body">
  <div class="loading-state" *ngIf="loading"><div class="spinner"></div> Cargando...</div>
  <ng-container *ngIf="!loading">
    <div class="alert alert-success mb-4" *ngIf="alertas.length === 0">
      ✅ Sin alertas activas. ¡Vas muy bien en todas tus asignaturas!
    </div>
    <div class="alerta-card {{a.nivel}}" *ngFor="let a of alertas">
      <div class="alerta-header">
        <div>
          <div class="alerta-asignatura">{{a.asignatura_nombre}}</div>
          <div class="alerta-corte">Corte {{a.corte}}</div>
        </div>
        <span class="badge badge-{{a.nivel}}">{{a.nivel}}</span>
      </div>
      <div class="alerta-notas">
        <div>
          <div class="nota-label">Nota actual</div>
          <div class="nota-value {{a.nivel === 'rojo' ? 'danger' : 'warning'}}">
            {{a.nota_actual?.toFixed(1) ?? '—'}}
          </div>
        </div>
        <div *ngIf="a.minimo_requerido != null">
          <div class="nota-label">Mínimo siguiente corte</div>
          <div class="nota-value {{a.minimo_requerido > 4 ? 'danger' : 'warning'}}">
            {{a.minimo_requerido.toFixed(1)}}
          </div>
        </div>
      </div>
      <div class="alerta-estrategia" *ngIf="a.estrategia_acciones">
        💡 {{a.estrategia_acciones}}
      </div>
    </div>
  </ng-container>
</div>
  `
})
export class DashboardEstudianteComponent implements OnInit {
  alertas: Alerta[] = [];
  loading = true;
  nombre = '';
  constructor(private svc: AlertaService, private auth: AuthService) {}
  ngOnInit() {
    this.nombre = this.auth.currentUser?.nombre ?? '';
    this.svc.getEstudiante().subscribe({
      next: d => { this.alertas = d; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
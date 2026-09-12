import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstudianteService } from '../../core/services/estudiante.service';
import { Estudiante, EstudianteCreate } from '../../shared/models/estudiante.model';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="topbar">
  <div><div class="topbar-title">Gestión de Estudiantes</div></div>
  <button class="btn btn-primary" (click)="abrirModal()">+ Nuevo estudiante</button>
</div>
<div class="page-body">
  <div class="alert alert-error mb-4" *ngIf="error">⚠️ {{error}}</div>
  <div class="alert alert-success mb-4" *ngIf="success">✅ {{success}}</div>
  <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
  <div class="card" *ngIf="!loading">
    <div class="card-body" style="padding:0">
      <div class="empty-state" *ngIf="estudiantes.length === 0">
        <span class="empty-icon">👥</span><p>No hay estudiantes registrados aún.</p>
      </div>
      <div class="table-wrapper" *ngIf="estudiantes.length > 0">
        <table>
          <thead><tr><th>Nombre</th><th>Código</th><th>Email</th><th>Programa</th><th>Semestre</th></tr></thead>
          <tbody>
            <tr *ngFor="let e of estudiantes">
              <td><strong>{{e.nombre}}</strong></td>
              <td class="text-sm" style="font-family:monospace;color:var(--uc-blue)">{{e.codigo}}</td>
              <td class="text-muted text-sm">{{e.email}}</td>
              <td>{{e.programa ?? '—'}}</td>
              <td>{{e.semestre ?? '—'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<div class="modal-overlay" *ngIf="showModal" (click)="cerrarModal()">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <span class="modal-title">Nuevo Estudiante</span>
      <button class="modal-close" (click)="cerrarModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label>Nombre completo</label>
          <input class="form-control" [(ngModel)]="form.nombre" placeholder="Juan Pérez" />
        </div>
        <div class="form-group">
          <label>Código</label>
          <input class="form-control" [(ngModel)]="form.codigo" placeholder="EST001" />
        </div>
      </div>
      <div class="form-group">
        <label>Email institucional</label>
        <input class="form-control" type="email" [(ngModel)]="form.email" placeholder="juan@universidad.edu" />
      </div>
      <div class="form-group">
        <label>Contraseña temporal</label>
        <input class="form-control" type="password" [(ngModel)]="form.password" placeholder="••••••••" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Programa</label>
          <input class="form-control" [(ngModel)]="form.programa" placeholder="Ingeniería de Sistemas" />
        </div>
        <div class="form-group">
          <label>Semestre</label>
          <input class="form-control" type="number" [(ngModel)]="form.semestre" placeholder="1" min="1" max="10" />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" (click)="cerrarModal()">Cancelar</button>
      <button class="btn btn-primary" (click)="crear()" [disabled]="saving">
        {{saving ? 'Guardando...' : 'Crear estudiante'}}
      </button>
    </div>
  </div>
</div>
  `
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading = true; showModal = false; saving = false;
  error = ''; success = '';
  form: EstudianteCreate = { nombre: '', email: '', password: '', codigo: '', programa: '', semestre: undefined };

  constructor(private svc: EstudianteService) {}

  ngOnInit() {
    this.svc.getAll().subscribe({ next: d => { this.estudiantes = d; this.loading = false; }, error: () => this.loading = false });
  }

  abrirModal() { this.showModal = true; this.error = ''; this.success = ''; }
  cerrarModal() { this.showModal = false; this.resetForm(); }
  resetForm() { this.form = { nombre: '', email: '', password: '', codigo: '', programa: '', semestre: undefined }; }

  crear() {
    if (!this.form.nombre || !this.form.email || !this.form.password || !this.form.codigo) {
      this.error = 'Completa todos los campos obligatorios'; return;
    }
    this.saving = true;
    this.svc.create(this.form).subscribe({
      next: e => {
        this.estudiantes.push(e);
        this.saving = false; this.showModal = false;
        this.success = 'Estudiante creado correctamente';
        this.resetForm();
        setTimeout(() => this.success = '', 4000);
      },
      error: err => {
        this.saving = false;
        this.error = err.error?.error ?? 'Error al crear el estudiante';
      }
    });
  }
}

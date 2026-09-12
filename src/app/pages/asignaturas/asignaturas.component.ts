import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { NotaService } from '../../core/services/nota.service';
import { HttpClient } from '@angular/common/http';
import { Asignatura, AsignaturaCreate } from '../../shared/models/asignatura.model';
import { Estudiante } from '../../shared/models/estudiante.model';

interface Docente { id: string; nombre: string; codigo: string; }

@Component({
  selector: 'app-asignaturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="topbar">
  <div><div class="topbar-title">Gestión de Asignaturas</div></div>
  <button class="btn btn-gold" (click)="abrirModal()">+ Nueva asignatura</button>
</div>
<div class="page-body">
  <div class="alert alert-error mb-4" *ngIf="error">⚠️ {{error}}</div>
  <div class="alert alert-success mb-4" *ngIf="success">✅ {{success}}</div>
  <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
  <div class="card" *ngIf="!loading">
    <div class="card-body" style="padding:0">
      <div class="empty-state" *ngIf="asignaturas.length === 0">
        <span class="empty-icon">📚</span><p>No hay asignaturas registradas.</p>
      </div>
      <div class="table-wrapper" *ngIf="asignaturas.length > 0">
        <table>
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Créditos</th><th>Período</th><th>Docente</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of asignaturas">
              <td style="font-family:monospace;color:var(--uc-blue)">{{a.codigo}}</td>
              <td><strong>{{a.nombre}}</strong></td>
              <td>{{a.creditos}}</td>
              <td><span class="badge badge-blue">{{a.periodo}}</span></td>
              <td>{{getNombreDocente(a.docente_id) || '—'}}</td>
              <td style="display:flex;gap:.5rem">
                <button class="btn btn-ghost btn-sm" (click)="abrirAsignarDocente(a)">👨‍🏫 Docente</button>
                <button class="btn btn-ghost btn-sm" (click)="abrirMatricular(a)">👥 Matricular</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Modal nueva asignatura -->
<div class="modal-overlay" *ngIf="showModal" (click)="cerrarModal()">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <span class="modal-title">Nueva Asignatura</span>
      <button class="modal-close" (click)="cerrarModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label>Código</label>
          <input class="form-control" [(ngModel)]="form.codigo" placeholder="MAT101" />
        </div>
        <div class="form-group">
          <label>Créditos</label>
          <input class="form-control" type="number" [(ngModel)]="form.creditos" />
        </div>
      </div>
      <div class="form-group">
        <label>Nombre de la asignatura</label>
        <input class="form-control" [(ngModel)]="form.nombre" placeholder="Cálculo Diferencial" />
      </div>
      <div class="form-group">
        <label>Período académico</label>
        <input class="form-control" [(ngModel)]="form.periodo" placeholder="2024-1" />
      </div>
      <div class="form-group">
        <label>Asignar docente (opcional)</label>
        <select class="form-control" [(ngModel)]="form.docente_id">
          <option value="">-- Sin docente asignado --</option>
          <option *ngFor="let d of docentes" [value]="d.id">{{d.nombre}} ({{d.codigo}})</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" (click)="cerrarModal()">Cancelar</button>
      <button class="btn btn-primary" (click)="crear()" [disabled]="saving">{{saving ? 'Guardando...' : 'Crear'}}</button>
    </div>
  </div>
</div>

<!-- Modal asignar docente -->
<div class="modal-overlay" *ngIf="showDocenteModal" (click)="showDocenteModal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <span class="modal-title">Asignar docente — {{asignaturaSeleccionada?.nombre}}</span>
      <button class="modal-close" (click)="showDocenteModal=false">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Seleccionar docente</label>
        <select class="form-control" [(ngModel)]="docenteSeleccionadoId">
          <option value="">-- Sin docente --</option>
          <option *ngFor="let d of docentes" [value]="d.id">{{d.nombre}} ({{d.codigo}})</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" (click)="showDocenteModal=false">Cancelar</button>
      <button class="btn btn-primary" (click)="asignarDocente()" [disabled]="saving">
        {{saving ? 'Guardando...' : 'Asignar'}}
      </button>
    </div>
  </div>
</div>

<!-- Modal matricular -->
<div class="modal-overlay" *ngIf="showMatricularModal" (click)="showMatricularModal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <span class="modal-title">Matricular en {{asignaturaSeleccionada?.nombre}}</span>
      <button class="modal-close" (click)="showMatricularModal=false">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Seleccionar estudiante</label>
        <select class="form-control" [(ngModel)]="estudianteSeleccionadoId">
          <option value="">-- Selecciona un estudiante --</option>
          <option *ngFor="let e of estudiantes" [value]="e.id">{{e.nombre}} ({{e.codigo}})</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" (click)="showMatricularModal=false">Cancelar</button>
      <button class="btn btn-primary" (click)="matricular()" [disabled]="!estudianteSeleccionadoId || saving">
        {{saving ? 'Matriculando...' : 'Matricular'}}
      </button>
    </div>
  </div>
</div>
  `
})
export class AsignaturasComponent implements OnInit {
  asignaturas: Asignatura[] = [];
  estudiantes: Estudiante[] = [];
  docentes: Docente[] = [];
  loading = true; showModal = false; showMatricularModal = false;
  showDocenteModal = false; saving = false;
  error = ''; success = '';
  form: any = { codigo: '', nombre: '', creditos: 3, periodo: '', docente_id: '' };
  asignaturaSeleccionada: Asignatura | null = null;
  estudianteSeleccionadoId = '';
  docenteSeleccionadoId = '';

  constructor(
    private svc: AsignaturaService,
    private estSvc: EstudianteService,
    private notaSvc: NotaService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.svc.getAll().subscribe({ next: d => { this.asignaturas = d; this.loading = false; }, error: () => this.loading = false });
    this.estSvc.getAll().subscribe({ next: d => this.estudiantes = d, error: () => {} });
    this.http.get<Docente[]>('/api/v1/docentes/').subscribe({ next: d => this.docentes = d, error: () => {} });
  }

  getNombreDocente(id: string | undefined): string {
    if (!id) return '';
    return this.docentes.find(d => d.id === id)?.nombre ?? '';
  }

  abrirModal() { this.showModal = true; this.error = ''; }
  cerrarModal() { this.showModal = false; this.form = { codigo: '', nombre: '', creditos: 3, periodo: '', docente_id: '' }; }

  crear() {
    if (!this.form.codigo || !this.form.nombre || !this.form.periodo) { this.error = 'Completa todos los campos'; return; }
    this.saving = true;
    const payload = { ...this.form, docente_id: this.form.docente_id || null };
    this.svc.create(payload).subscribe({
      next: a => {
        this.asignaturas.push(a); this.saving = false; this.showModal = false;
        this.success = 'Asignatura creada'; setTimeout(() => this.success = '', 4000);
      },
      error: err => { this.saving = false; this.error = err.error?.error ?? 'Error'; }
    });
  }

  abrirAsignarDocente(a: Asignatura) {
    this.asignaturaSeleccionada = a;
    this.docenteSeleccionadoId = a.docente_id ?? '';
    this.showDocenteModal = true;
  }

  asignarDocente() {
    if (!this.asignaturaSeleccionada) return;
    this.saving = true;
    this.http.patch(`/api/v1/asignaturas/${this.asignaturaSeleccionada.id}/asignar-docente`,
      { docente_id: this.docenteSeleccionadoId || null }).subscribe({
      next: () => {
        this.saving = false; this.showDocenteModal = false;
        this.success = 'Docente asignado correctamente';
        this.svc.getAll().subscribe({ next: d => this.asignaturas = d, error: () => {} });
        setTimeout(() => this.success = '', 4000);
      },
      error: err => { this.saving = false; this.error = err.error?.error ?? 'Error'; }
    });
  }

  abrirMatricular(a: Asignatura) {
    this.asignaturaSeleccionada = a;
    this.showMatricularModal = true;
    this.estudianteSeleccionadoId = '';
  }

  matricular() {
    if (!this.estudianteSeleccionadoId || !this.asignaturaSeleccionada) return;
    this.saving = true;
    this.notaSvc.matricular(this.estudianteSeleccionadoId, this.asignaturaSeleccionada.id).subscribe({
      next: () => {
        this.saving = false; this.showMatricularModal = false;
        this.success = 'Estudiante matriculado correctamente';
        setTimeout(() => this.success = '', 4000);
      },
      error: err => { this.saving = false; this.error = err.error?.error ?? 'Error al matricular'; }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Docente {
  id: string; codigo: string; nombre: string;
  email: string; departamento?: string;
}

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="topbar">
  <div><div class="topbar-title">Gestión de Docentes</div></div>
  <button class="btn btn-gold" (click)="showModal=true">+ Nuevo docente</button>
</div>
<div class="page-body">
  <div class="alert alert-error mb-4" *ngIf="error">⚠️ {{error}}</div>
  <div class="alert alert-success mb-4" *ngIf="success">✅ {{success}}</div>
  <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
  <div class="card" *ngIf="!loading">
    <div class="card-body" style="padding:0">
      <div class="empty-state" *ngIf="docentes.length === 0">
        <span class="empty-icon">👨‍🏫</span>
        <p>No hay docentes registrados aún.</p>
      </div>
      <div class="table-wrapper" *ngIf="docentes.length > 0">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Código</th><th>Email</th><th>Departamento</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of docentes">
              <td><strong>{{d.nombre}}</strong></td>
              <td style="font-family:monospace;color:var(--uc-blue)">{{d.codigo}}</td>
              <td class="text-muted text-sm">{{d.email}}</td>
              <td>{{d.departamento || '—'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<div class="modal-overlay" *ngIf="showModal" (click)="showModal=false">
  <div class="modal" (click)="$event.stopPropagation()">
    <div class="modal-header">
      <span class="modal-title">Nuevo Docente</span>
      <button class="modal-close" (click)="showModal=false">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-group">
          <label>Nombre completo</label>
          <input class="form-control" [(ngModel)]="form.nombre" placeholder="Prof. Juan García" />
        </div>
        <div class="form-group">
          <label>Código</label>
          <input class="form-control" [(ngModel)]="form.codigo" placeholder="DOC001" />
        </div>
      </div>
      <div class="form-group">
        <label>Email institucional</label>
        <input class="form-control" type="email" [(ngModel)]="form.email" placeholder="docente@unicatolica.edu.co" />
      </div>
      <div class="form-group">
        <label>Contraseña temporal</label>
        <input class="form-control" type="password" [(ngModel)]="form.password" placeholder="••••••••" />
      </div>
      <div class="form-group">
        <label>Departamento</label>
        <input class="form-control" [(ngModel)]="form.departamento" placeholder="Ingeniería de Sistemas" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" (click)="showModal=false">Cancelar</button>
      <button class="btn btn-primary" (click)="crear()" [disabled]="saving">
        {{saving ? 'Guardando...' : 'Crear docente'}}
      </button>
    </div>
  </div>
</div>
  `
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  loading = true; showModal = false; saving = false;
  error = ''; success = '';
  form = { nombre: '', email: '', password: '', codigo: '', departamento: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Docente[]>('/api/v1/docentes/').subscribe({
      next: d => { this.docentes = d; this.loading = false; },
      error: () => this.loading = false
    });
  }

  crear() {
    if (!this.form.nombre || !this.form.email || !this.form.password || !this.form.codigo) {
      this.error = 'Completa todos los campos obligatorios'; return;
    }
    this.saving = true;
    this.http.post<Docente>('/api/v1/docentes/', this.form).subscribe({
      next: d => {
        this.docentes.push(d);
        this.saving = false; this.showModal = false;
        this.success = 'Docente creado correctamente';
        this.form = { nombre: '', email: '', password: '', codigo: '', departamento: '' };
        setTimeout(() => this.success = '', 4000);
      },
      error: err => {
        this.saving = false;
        this.error = err.error?.error ?? 'Error al crear el docente';
      }
    });
  }
}
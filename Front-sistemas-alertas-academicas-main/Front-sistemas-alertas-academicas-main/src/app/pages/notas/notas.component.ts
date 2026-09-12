import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsignaturaService } from '../../core/services/asignatura.service';
import { NotaService } from '../../core/services/nota.service';
import { EstudianteService } from '../../core/services/estudiante.service';
import { Asignatura } from '../../shared/models/asignatura.model';
import { Matricula } from '../../shared/models/matricula.model';
import { Estudiante } from '../../shared/models/estudiante.model';

@Component({
  selector: 'app-notas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="topbar">
  <div><div class="topbar-title">Ingresar Notas</div></div>
</div>
<div class="page-body">
  <div class="alert alert-error mb-4" *ngIf="error">{{ error }}</div>
  <div class="alert alert-success mb-4" *ngIf="success">{{ success }}</div>
  <div class="card mb-4" *ngIf="!asignaturaSeleccionada">
    <div class="card-header"><span class="card-title">Selecciona una asignatura</span></div>
    <div class="card-body">
      <div class="loading-state" *ngIf="loading"><div class="spinner"></div></div>
      <div class="empty-state" *ngIf="!loading && asignaturas.length === 0">
        <span class="empty-icon">📚</span><p>No hay asignaturas registradas.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem" *ngIf="!loading">
        <div class="card" *ngFor="let a of asignaturas" (click)="seleccionar(a)"
          style="cursor:pointer;border:1.5px solid var(--uc-gray-200);padding:1rem">
          <div style="font-weight:700;color:var(--uc-blue)">{{a.nombre}}</div>
          <div style="font-size:.8rem;color:var(--uc-gray-400)">{{a.codigo}} | {{a.periodo}}</div>
        </div>
      </div>
    </div>
  </div>
  <ng-container *ngIf="asignaturaSeleccionada">
    <div class="flex items-center justify-between mb-4">
      <h2 style="font-size:1.1rem;font-weight:700;color:var(--uc-blue)">{{ asignaturaSeleccionada.nombre }}</h2>
      <button class="btn btn-ghost" (click)="asignaturaSeleccionada=null">← Cambiar</button>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <div class="loading-state" *ngIf="loadingNotas"><div class="spinner"></div></div>
        <div class="empty-state" *ngIf="!loadingNotas && matriculas.length === 0">
          <span class="empty-icon">📋</span><p>Sin estudiantes matriculados.</p>
        </div>
        <div class="table-wrapper" *ngIf="!loadingNotas && matriculas.length > 0">
          <table>
            <thead><tr><th>Estudiante</th><th>Corte 1</th><th>Corte 2</th><th>Corte 3</th><th>Final</th><th></th></tr></thead>
            <tbody>
<tr *ngFor="let m of matriculas">
  <td><strong>{{nombre(m.estudiante_id)}}</strong></td>

  <td>
    <input class="nota-input" type="number" min="0" max="5" step="0.1"
      [value]="m.nota_corte1 ?? ''"
      (change)="edits[m.id+'.c1'] = $any($event.target).value" />
  </td>

  <td>
    <input class="nota-input" type="number" min="0" max="5" step="0.1"
      [value]="m.nota_corte2 ?? ''"
      (change)="edits[m.id+'.c2'] = $any($event.target).value" />
  </td>

  <td>
    <input class="nota-input" type="number" min="0" max="5" step="0.1"
      [value]="m.nota_corte3 ?? ''"
      (change)="edits[m.id+'.c3'] = $any($event.target).value" />
  </td>

  <td>
    <strong style="color:var(--uc-blue)">
      {{m.nota_final?.toFixed(2) ?? '—'}}
    </strong>
  </td>

  <td>
    <button class="btn btn-yellow btn-sm"
      (click)="guardar(m)"
      [disabled]="guardando[m.id]">
      {{guardando[m.id] ? '...' : 'Guardar'}}
    </button>
  </td>
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
export class NotasComponent implements OnInit {
  asignaturas: Asignatura[] = [];
  matriculas: Matricula[] = [];
  estudiantes: Estudiante[] = [];
  asignaturaSeleccionada: Asignatura | null = null;
  loading = true; loadingNotas = false;
  error = ''; success = '';
  edits: Record<string, any> = {};
  guardando: Record<string, boolean> = {};

  constructor(private asigSvc: AsignaturaService, private notaSvc: NotaService, private estSvc: EstudianteService) {}

  ngOnInit() {
    this.asigSvc.getAll().subscribe({ next: d => { this.asignaturas = d; this.loading = false; }, error: () => this.loading = false });
    this.estSvc.getAll().subscribe({ next: d => this.estudiantes = d, error: () => {} });
  }

  seleccionar(a: Asignatura) {
    this.asignaturaSeleccionada = a; this.loadingNotas = true;
    this.notaSvc.getByAsignatura(a.id).subscribe({ next: d => { this.matriculas = d; this.loadingNotas = false; }, error: () => this.loadingNotas = false });
  }

  nombre(id: string) { return this.estudiantes.find(e => e.id === id)?.nombre ?? id.slice(0,8) + '...'; }

guardar(m: Matricula) {
  const payload: any = {};

  const c1 = this.edits[m.id + '.c1'];
  const c2 = this.edits[m.id + '.c2'];
  const c3 = this.edits[m.id + '.c3'];

  if (c1 !== undefined)
    payload.nota_corte1 = c1 === '' ? null : parseFloat(c1);

  if (c2 !== undefined)
    payload.nota_corte2 = c2 === '' ? null : parseFloat(c2);

  if (c3 !== undefined)
    payload.nota_corte3 = c3 === '' ? null : parseFloat(c3);

  this.guardando[m.id] = true;

  this.notaSvc.updateNota(m.id, payload).subscribe({
    next: () => {
      this.guardando[m.id] = false;
      this.success = 'Nota guardada correctamente';
      setTimeout(() => this.success = '', 3000);
      this.seleccionar(this.asignaturaSeleccionada!);
    },
    error: err => {
      console.log(err);
      this.guardando[m.id] = false;
      this.error = JSON.stringify(err.error);
    }
  });
}
}

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/dashboard-docente/dashboard-docente.component').then(m => m.DashboardDocenteComponent) },
      { path: 'mis-alertas', loadComponent: () => import('./pages/dashboard-estudiante/dashboard-estudiante.component').then(m => m.DashboardEstudianteComponent) },
      { path: 'estudiantes', loadComponent: () => import('./pages/estudiantes/estudiantes.component').then(m => m.EstudiantesComponent) },
      { path: 'docentes', loadComponent: () => import('./pages/docentes/docentes.component').then(m => m.DocentesComponent) },
      { path: 'asignaturas', loadComponent: () => import('./pages/asignaturas/asignaturas.component').then(m => m.AsignaturasComponent) },
      { path: 'notas', loadComponent: () => import('./pages/notas/notas.component').then(m => m.NotasComponent) },
      { path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
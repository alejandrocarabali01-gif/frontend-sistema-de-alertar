# Frontend Angular - Alertas Académicas UNICATÓLICA

## Requisitos
- Node.js 18+
- Angular CLI 21: `npm install -g @angular/cli`
- Backend Flask corriendo en http://localhost:5000

## Instalación y arranque

```bash
npm install
npm start
```

Abre: http://localhost:4200

## Credenciales por defecto
- Admin: admin@universidad.edu / admin123

## Endpoints que consume (del backend Flask)
- POST /api/v1/auth/login
- GET/POST /api/v1/estudiantes/
- GET/POST /api/v1/asignaturas/
- GET /api/v1/notas/asignatura/{id}
- PATCH /api/v1/notas/matricula/{id}
- POST /api/v1/notas/matricular/{est_id}/{asig_id}
- GET /api/v1/alertas/docente
- GET /api/v1/alertas/estudiante
- GET /api/v1/alertas/admin

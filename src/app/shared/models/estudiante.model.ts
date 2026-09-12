export interface Estudiante {
  id: string; codigo: string; nombre: string;
  email: string; programa?: string; semestre?: number;
}
export interface EstudianteCreate {
  nombre: string; email: string; password: string;
  codigo: string; programa?: string; semestre?: number;
}
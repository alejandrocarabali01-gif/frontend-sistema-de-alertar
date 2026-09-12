export interface Asignatura {
  id: string; codigo: string; nombre: string;
  creditos: number; periodo: string;
}
export interface AsignaturaCreate {
  codigo: string; nombre: string; creditos: number; periodo: string;
}
export interface Asignatura {
  id: string; codigo: string; nombre: string;
  creditos: number; periodo: string;
  docente_id?: string;
}
export interface AsignaturaCreate {
  codigo: string; nombre: string; creditos: number;
  periodo: string; docente_id?: string | null;
}

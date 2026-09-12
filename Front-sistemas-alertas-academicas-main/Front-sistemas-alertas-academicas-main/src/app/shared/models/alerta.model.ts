export interface Alerta {
  id: string; matricula_id: string; corte: number;
  nivel: 'verde' | 'amarillo' | 'rojo';
  nota_actual?: number; minimo_requerido?: number;
  notificado: boolean; creada_en: string;
  estudiante_nombre?: string; estudiante_codigo?: string;
  asignatura_nombre?: string;
  estrategia_mensaje?: string; estrategia_acciones?: string;
}
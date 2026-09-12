export interface Matricula {
  id: string; estudiante_id: string; asignatura_id: string;
  nota_corte1?: number; nota_corte2?: number;
  nota_corte3?: number; nota_final?: number;
}
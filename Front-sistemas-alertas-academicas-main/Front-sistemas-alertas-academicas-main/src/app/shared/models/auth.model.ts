export interface LoginRequest { email: string; password: string; }
export interface AuthResponse {
  access_token: string; token_type: string;
  rol: string; nombre: string; user_id: string;
}
export interface User { nombre: string; rol: string; user_id: string; token: string; }
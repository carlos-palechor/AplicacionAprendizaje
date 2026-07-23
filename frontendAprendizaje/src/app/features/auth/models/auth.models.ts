export type TipoCuenta = 'estudiante' | 'profesional';
export type ModoAuth = 'login' | 'registro';

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
  errores?: string[];
}

export interface LoginPayload {
  correo: string;
  contrasena: string;
}

export interface RegistroBasePayload extends LoginPayload {
  id_rol: number;
  nombres: string;
  apellidos: string;
}

export interface RegistroProfesionalPayload extends RegistroBasePayload {
  universidad: string;
  titulo_profesional: string;
  especializacion: string;
  descripcion_perfil: string;
  linkedin_url: string;
  disponibilidad: string;
}

export type RegistroPayload = RegistroBasePayload | RegistroProfesionalPayload;

export interface GoogleAuthPayload {
  id_token: string;
  universidad?: string;
  titulo_profesional?: string;
  especializacion?: string;
  descripcion_perfil?: string;
  linkedin_url?: string;
  disponibilidad?: string;
}

export interface LoginResponse {
  token: string;
  estudiante?: unknown;
  profesional?: unknown;
}

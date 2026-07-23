import {
  GoogleAuthPayload,
  ModoAuth,
  RegistroPayload,
  TipoCuenta
} from '../models/auth.models';

export const CAMPOS_PROFESIONAL = [
  'universidad',
  'titulo_profesional',
  'especializacion',
  'descripcion_perfil',
  'linkedin_url',
  'disponibilidad'
];

interface RegistroFormValue {
  nombres: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  universidad: string;
  titulo_profesional: string;
  especializacion: string;
  descripcion_perfil: string;
  linkedin_url: string;
  disponibilidad: string;
}

export function obtenerPayloadRegistro(
  valor: RegistroFormValue,
  tipoCuenta: TipoCuenta
): RegistroPayload {
  const payloadBase = {
    id_rol: tipoCuenta === 'estudiante' ? 1 : 2,
    nombres: valor.nombres.trim(),
    apellidos: valor.apellidos.trim(),
    correo: valor.correo.trim(),
    contrasena: valor.contrasena
  };

  if (tipoCuenta === 'estudiante') {
    return payloadBase;
  }

  return {
    ...payloadBase,
    universidad: valor.universidad.trim(),
    titulo_profesional: valor.titulo_profesional.trim(),
    especializacion: valor.especializacion.trim(),
    descripcion_perfil: valor.descripcion_perfil.trim(),
    linkedin_url: valor.linkedin_url.trim(),
    disponibilidad: valor.disponibilidad.trim()
  };
}

export function obtenerPayloadGoogle(
  idToken: string,
  valor: RegistroFormValue,
  tipoCuenta: TipoCuenta,
  modo: ModoAuth
): GoogleAuthPayload {
  if (tipoCuenta === 'estudiante' || modo === 'login') {
    return { id_token: idToken };
  }

  return {
    id_token: idToken,
    universidad: valor.universidad.trim(),
    titulo_profesional: valor.titulo_profesional.trim(),
    especializacion: valor.especializacion.trim(),
    descripcion_perfil: valor.descripcion_perfil.trim(),
    linkedin_url: valor.linkedin_url.trim(),
    disponibilidad: valor.disponibilidad.trim()
  };
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

export interface EstadisticasPublicas {
  profesionales_activos: number;
  servicios_disponibles: number;
  calificacion_promedio: number;
  servicios_completados: number;
}

export interface CategoriaPublica {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string | null;
  estado: string;
  total_servicios: number;
}

export interface ServicioDestacado {
  id_servicio: number;
  id_profesional: number;
  id_categoria: number;
  titulo: string;
  descripcion: string | null;
  precio: string;
  modalidad: string | null;
  tiempo_estimado: string | null;
  categoria_servicio: {
    id_categoria: number;
    nombre_categoria: string;
  };
  profesional: {
    id_profesional: number;
    nombres: string;
    apellidos: string;
    universidad: string | null;
    titulo_profesional: string | null;
    especializacion: string | null;
    verificado: boolean;
  };
  reputacion: {
    promedio: number;
    total_calificaciones: number;
  };
}

export interface ProfesionalDestacado {
  id_profesional: number;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  universidad: string | null;
  titulo_profesional: string | null;
  especializacion: string | null;
  descripcion_perfil: string | null;
  linkedin_url: string | null;
  disponibilidad: string | null;
  verificado: boolean;
  servicios: Array<{
    id_servicio: number;
    titulo: string;
    id_categoria: number;
    estado: string;
    categoria_servicio: {
      id_categoria: number;
      nombre_categoria: string;
    };
  }>;
  reputacion: {
    promedio: number;
    total_calificaciones: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PublicoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/publico`;

  constructor(private readonly http: HttpClient) {}

  obtenerEstadisticas(): Observable<ApiResponse<EstadisticasPublicas>> {
    return this.http.get<ApiResponse<EstadisticasPublicas>>(`${this.apiUrl}/estadisticas`);
  }

  obtenerCategorias(): Observable<ApiResponse<CategoriaPublica[]>> {
    return this.http.get<ApiResponse<CategoriaPublica[]>>(`${this.apiUrl}/categorias`);
  }

  obtenerServiciosDestacados(): Observable<ApiResponse<ServicioDestacado[]>> {
    return this.http.get<ApiResponse<ServicioDestacado[]>>(`${this.apiUrl}/servicios-destacados`);
  }

  obtenerProfesionalesDestacados(): Observable<ApiResponse<ProfesionalDestacado[]>> {
    return this.http.get<ApiResponse<ProfesionalDestacado[]>>(`${this.apiUrl}/profesionales-destacados`);
  }
}

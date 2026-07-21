import { Component, Input } from '@angular/core';
import { ProfesionalDestacado } from '../../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-featured-professionals',
  imports: [],
  templateUrl: './featured-professionals.component.html',
  styleUrl: './featured-professionals.component.scss'
})
export class FeaturedProfessionalsComponent {
  @Input() profesionales: ProfesionalDestacado[] = [];

  obtenerEspecialidad(profesional: ProfesionalDestacado): string {
    return profesional.titulo_profesional || profesional.especializacion || 'Profesional academico';
  }

  obtenerTextoRating(profesional: ProfesionalDestacado): string {
    const total = profesional.reputacion.total_calificaciones;

    if (total === 0) {
      return 'Nuevo profesional';
    }

    return `${profesional.reputacion.promedio}/5 (${total} resenas)`;
  }

  obtenerCategoriasUnicas(profesional: ProfesionalDestacado): string[] {
    const categorias = profesional.servicios.map((servicio) => servicio.categoria_servicio.nombre_categoria);

    return [...new Set(categorias)].slice(0, 3);
  }
}

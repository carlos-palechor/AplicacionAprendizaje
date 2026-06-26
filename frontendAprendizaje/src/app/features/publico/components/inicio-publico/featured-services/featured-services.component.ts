import { Component, Input } from '@angular/core';
import { ServicioDestacado } from '../../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-featured-services',
  imports: [],
  templateUrl: './featured-services.component.html',
  styleUrl: './featured-services.component.scss'
})
export class FeaturedServicesComponent {
  @Input() servicios: ServicioDestacado[] = [];

  obtenerNombreProfesional(servicio: ServicioDestacado): string {
    return `${servicio.profesional.nombres} ${servicio.profesional.apellidos}`.trim();
  }
}

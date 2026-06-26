import { Component, Input } from '@angular/core';
import { EstadisticasPublicas } from '../../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-public-stats',
  imports: [],
  templateUrl: './public-stats.component.html',
  styleUrl: './public-stats.component.scss'
})
export class PublicStatsComponent {
  @Input() estadisticas: EstadisticasPublicas | null = null;
}

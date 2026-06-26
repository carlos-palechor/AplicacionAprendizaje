import { Component, Input } from '@angular/core';
import { CategoriaPublica, EstadisticasPublicas } from '../../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-public-hero',
  imports: [],
  templateUrl: './public-hero.component.html',
  styleUrl: './public-hero.component.scss'
})
export class PublicHeroComponent {
  @Input() estadisticas: EstadisticasPublicas | null = null;
  @Input() categorias: CategoriaPublica[] = [];
}

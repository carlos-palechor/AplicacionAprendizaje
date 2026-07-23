import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoriaPublica, EstadisticasPublicas } from '../../services/publico.service';

@Component({
  selector: 'app-public-hero',
  imports: [],
  templateUrl: './public-hero.component.html',
  styleUrl: './public-hero.component.scss'
})
export class PublicHeroComponent {
  @Input() estadisticas: EstadisticasPublicas | null = null;
  @Input() categorias: CategoriaPublica[] = [];
  @Output() categoriaSeleccionada = new EventEmitter<number>();

  seleccionarCategoria(idCategoria: number): void {
    this.categoriaSeleccionada.emit(idCategoria);
  }
}

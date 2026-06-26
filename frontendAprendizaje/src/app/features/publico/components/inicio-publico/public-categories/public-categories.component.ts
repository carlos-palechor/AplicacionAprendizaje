import { Component, Input } from '@angular/core';
import { CategoriaPublica } from '../../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-public-categories',
  imports: [],
  templateUrl: './public-categories.component.html',
  styleUrl: './public-categories.component.scss'
})
export class PublicCategoriesComponent {
  @Input() categorias: CategoriaPublica[] = [];
}

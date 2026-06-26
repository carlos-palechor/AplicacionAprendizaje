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
}

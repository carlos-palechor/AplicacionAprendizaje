import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { InicioPublicoComponent } from './features/publico/pages/inicio-publico/inicio-publico.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: InicioPublicoComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
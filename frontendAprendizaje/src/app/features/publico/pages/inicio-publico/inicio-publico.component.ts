import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FeaturedProfessionalsComponent } from '../../components/inicio-publico/featured-professionals/featured-professionals.component';
import { FeaturedServicesComponent } from '../../components/inicio-publico/featured-services/featured-services.component';
import { HowItWorksComponent } from '../../components/inicio-publico/how-it-works/how-it-works.component';
import { PublicCategoriesComponent } from '../../components/inicio-publico/public-categories/public-categories.component';
import { PublicCtaComponent } from '../../components/inicio-publico/public-cta/public-cta.component';
import { PublicFooterComponent } from '../../components/inicio-publico/public-footer/public-footer.component';
import { PublicHeroComponent } from '../../components/inicio-publico/public-hero/public-hero.component';
import { PublicNavbarComponent } from '../../components/inicio-publico/public-navbar/public-navbar.component';
import { PublicStatsComponent } from '../../components/inicio-publico/public-stats/public-stats.component';
import {
  CategoriaPublica,
  EstadisticasPublicas,
  ProfesionalDestacado,
  PublicoService,
  ServicioDestacado
} from '../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-inicio-publico',
  imports: [
    PublicNavbarComponent,
    PublicHeroComponent,
    PublicStatsComponent,
    PublicCategoriesComponent,
    FeaturedServicesComponent,
    FeaturedProfessionalsComponent,
    HowItWorksComponent,
    PublicCtaComponent,
    PublicFooterComponent
  ],
  templateUrl: './inicio-publico.component.html',
  styleUrl: './inicio-publico.component.scss'
})
export class InicioPublicoComponent implements OnInit {
  estadisticas: EstadisticasPublicas | null = null;
  categorias: CategoriaPublica[] = [];
  serviciosDestacados: ServicioDestacado[] = [];
  profesionalesDestacados: ProfesionalDestacado[] = [];
  cargando = true;

  constructor(private readonly publicoService: PublicoService) {}

  ngOnInit(): void {
    this.cargarDatosPublicos();
  }

  private cargarDatosPublicos(): void {
    forkJoin({
      estadisticas: this.publicoService.obtenerEstadisticas(),
      categorias: this.publicoService.obtenerCategorias(),
      serviciosDestacados: this.publicoService.obtenerServiciosDestacados(),
      profesionalesDestacados: this.publicoService.obtenerProfesionalesDestacados()
    }).subscribe({
      next: (respuesta) => {
        this.estadisticas = respuesta.estadisticas.data;
        this.categorias = respuesta.categorias.data;
        this.serviciosDestacados = respuesta.serviciosDestacados.data;
        this.profesionalesDestacados = respuesta.profesionalesDestacados.data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }
}

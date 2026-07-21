import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FeaturedProfessionalsComponent } from '../../components/inicio-publico/featured-professionals/featured-professionals.component';
import { FeaturedServicesComponent } from '../../components/inicio-publico/featured-services/featured-services.component';
import { HowItWorksComponent } from '../../components/inicio-publico/how-it-works/how-it-works.component';
import { PublicCtaComponent } from '../../components/inicio-publico/public-cta/public-cta.component';
import { PublicFooterComponent } from '../../components/inicio-publico/public-footer/public-footer.component';
import { PublicHeroComponent } from '../../components/inicio-publico/public-hero/public-hero.component';
import { PublicNavbarComponent } from '../../components/inicio-publico/public-navbar/public-navbar.component';
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
  servicioSeleccionadoId: number | null = null;
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

  seleccionarServicio(idServicio: number): void {
    this.servicioSeleccionadoId = idServicio;
  }

  seleccionarCategoria(idCategoria: number): void {
    const servicio = this.serviciosDestacados.find((servicioDestacado) => {
      return servicioDestacado.id_categoria === idCategoria;
    });

    if (servicio) {
      this.seleccionarServicio(servicio.id_servicio);
      return;
    }

    document.getElementById('servicios')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

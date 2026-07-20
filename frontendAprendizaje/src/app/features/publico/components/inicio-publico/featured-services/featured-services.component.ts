import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ServicioDestacado } from '../../../services/inicio-publico/publico.service';

@Component({
  selector: 'app-featured-services',
  imports: [],
  templateUrl: './featured-services.component.html',
  styleUrl: './featured-services.component.scss'
})
export class FeaturedServicesComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() servicios: ServicioDestacado[] = [];
  @Input() servicioSeleccionadoId: number | null = null;
  @ViewChildren('tarjetaServicio') tarjetas!: QueryList<ElementRef<HTMLElement>>;

  indiceActual = 0;
  serviciosVisibles = 2;
  desplazamientoPx = 0;
  servicioResaltadoId: number | null = null;

  private autoplayId: ReturnType<typeof setInterval> | null = null;
  private resaltadoId: ReturnType<typeof setTimeout> | null = null;
  private tarjetasSubscription?: Subscription;

  ngAfterViewInit(): void {
    this.actualizarServiciosVisibles();
    this.tarjetasSubscription = this.tarjetas.changes.subscribe(() => {
      this.sincronizarCarrusel();
    });
    this.sincronizarCarrusel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicios']) {
      this.indiceActual = 0;
      setTimeout(() => this.sincronizarCarrusel());
    }

    if (changes['servicioSeleccionadoId'] && this.servicioSeleccionadoId) {
      const idServicio = this.servicioSeleccionadoId;
      setTimeout(() => this.mostrarServicioSeleccionado(idServicio));
    }
  }

  ngOnDestroy(): void {
    this.detenerAutoplay();
    this.detenerResaltado();
    this.tarjetasSubscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.actualizarServiciosVisibles();
    this.ajustarIndice();
    this.actualizarDesplazamiento();
    this.reiniciarAutoplay();
  }

  get puedeMoverse(): boolean {
    return this.servicios.length > this.serviciosVisibles;
  }

  obtenerNombreProfesional(servicio: ServicioDestacado): string {
    return `${servicio.profesional.nombres} ${servicio.profesional.apellidos}`.trim();
  }

  anterior(): void {
    if (!this.puedeMoverse) {
      return;
    }

    this.indiceActual = this.indiceActual === 0 ? this.indiceMaximo : this.indiceActual - 1;
    this.actualizarDesplazamiento();
    this.reiniciarAutoplay();
  }

  siguiente(): void {
    if (!this.puedeMoverse) {
      return;
    }

    this.indiceActual = this.indiceActual >= this.indiceMaximo ? 0 : this.indiceActual + 1;
    this.actualizarDesplazamiento();
  }

  pausarAutoplay(): void {
    this.detenerAutoplay();
  }

  reanudarAutoplay(): void {
    this.iniciarAutoplay();
  }

  private get indiceMaximo(): number {
    return Math.max(this.servicios.length - this.serviciosVisibles, 0);
  }

  private sincronizarCarrusel(): void {
    this.actualizarServiciosVisibles();
    this.ajustarIndice();
    this.actualizarDesplazamiento();
    this.reiniciarAutoplay();
  }

  private actualizarServiciosVisibles(): void {
    this.serviciosVisibles = typeof window !== 'undefined' && window.innerWidth <= 700 ? 1 : 2;
  }

  private ajustarIndice(): void {
    this.indiceActual = Math.min(this.indiceActual, this.indiceMaximo);
  }

  private actualizarDesplazamiento(): void {
    const tarjeta = this.tarjetas?.get(this.indiceActual)?.nativeElement;
    this.desplazamientoPx = tarjeta?.offsetLeft ?? 0;
  }

  private iniciarAutoplay(): void {
    this.detenerAutoplay();

    if (!this.puedeMoverse) {
      return;
    }

    this.autoplayId = setInterval(() => this.siguiente(), 4000);
  }

  private reiniciarAutoplay(): void {
    this.iniciarAutoplay();
  }

  private detenerAutoplay(): void {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  private mostrarServicioSeleccionado(idServicio: number): void {
    const indiceServicio = this.servicios.findIndex((servicio) => servicio.id_servicio === idServicio);

    if (indiceServicio === -1) {
      return;
    }

    this.indiceActual = Math.min(indiceServicio, this.indiceMaximo);
    this.actualizarDesplazamiento();
    this.servicioResaltadoId = idServicio;
    this.detenerAutoplay();

    document.getElementById('servicios')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    this.detenerResaltado();
    this.resaltadoId = setTimeout(() => {
      this.servicioResaltadoId = null;
      this.iniciarAutoplay();
    }, 4200);
  }

  private detenerResaltado(): void {
    if (this.resaltadoId) {
      clearTimeout(this.resaltadoId);
      this.resaltadoId = null;
    }
  }
}

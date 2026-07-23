import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioDestacado } from '../../services/publico.service';

@Component({
  selector: 'app-public-navbar',
  imports: [RouterLink],
  templateUrl: './public-navbar.component.html',
  styleUrl: './public-navbar.component.scss'
})
export class PublicNavbarComponent {
  @Input() servicios: ServicioDestacado[] = [];
  @Output() servicioSeleccionado = new EventEmitter<number>();

  busqueda = '';
  resultados: ServicioDestacado[] = [];

  buscar(valor: string): void {
    this.busqueda = valor;
    const termino = this.normalizar(valor);

    if (termino.length < 2) {
      this.resultados = [];
      return;
    }

    this.resultados = this.servicios
      .filter((servicio) => this.textoServicio(servicio).includes(termino))
      .slice(0, 6);
  }

  seleccionarServicio(servicio: ServicioDestacado): void {
    this.busqueda = servicio.titulo;
    this.resultados = [];
    this.servicioSeleccionado.emit(servicio.id_servicio);
  }

  seleccionarPrimerResultado(): void {
    const [primerResultado] = this.resultados;

    if (primerResultado) {
      this.seleccionarServicio(primerResultado);
    }
  }

  ocultarResultados(): void {
    setTimeout(() => {
      this.resultados = [];
    }, 140);
  }

  private textoServicio(servicio: ServicioDestacado): string {
    return this.normalizar([
      servicio.titulo,
      servicio.descripcion,
      servicio.categoria_servicio.nombre_categoria,
      servicio.profesional.nombres,
      servicio.profesional.apellidos,
      servicio.profesional.titulo_profesional,
      servicio.profesional.especializacion
    ].filter(Boolean).join(' '));
  }

  private normalizar(valor: string): string {
    return valor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GoogleAuthService } from '../../services/google-auth.service';
import { ModoAuth, TipoCuenta } from '../../models/auth.models';
import { CAMPOS_PROFESIONAL, obtenerPayloadGoogle, obtenerPayloadRegistro } from '../../utils/auth-payload.util';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss', './auth-page.social.scss', './auth-page.responsive.scss']
})
export class AuthPageComponent implements OnInit, AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly googleAuthService = inject(GoogleAuthService);
  private readonly route = inject(ActivatedRoute);
  @ViewChild('googleButton') googleButton?: ElementRef<HTMLElement>;

  modo: ModoAuth = 'registro';
  tipoCuenta: TipoCuenta = 'estudiante';
  pasoProfesional = 1;
  cargando = false;
  mensaje = '';
  error = '';

  readonly loginForm = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  readonly registroForm = this.fb.nonNullable.group({
    nombres: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    universidad: [''],
    titulo_profesional: [''],
    especializacion: [''],
    descripcion_perfil: [''],
    linkedin_url: [''],
    disponibilidad: ['Disponible'],
    terminos: [false, [Validators.requiredTrue]]
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const modo = params.get('modo');
      const tipo = params.get('tipo');

      if (modo === 'login' || modo === 'registro') {
        this.cambiarModo(modo);
      }

      if (tipo === 'estudiante' || tipo === 'profesional') {
        this.cambiarTipoCuenta(tipo);
      }
    });
  }

  ngAfterViewInit(): void {
    this.renderizarBotonGoogle();
  }

  cambiarModo(modo: ModoAuth): void {
    this.modo = modo;
    this.limpiarEstado();
    setTimeout(() => this.renderizarBotonGoogle());
  }

  cambiarTipoCuenta(tipoCuenta: TipoCuenta): void {
    this.tipoCuenta = tipoCuenta;
    this.pasoProfesional = 1;
    this.configurarValidadoresProfesional();
    this.limpiarEstado();
    setTimeout(() => this.renderizarBotonGoogle());
  }

  avanzarProfesional(): void {
    this.marcarCampos(['nombres', 'apellidos', 'correo', 'contrasena']);

    if (this.camposCuentaInvalidos) {
      return;
    }

    this.pasoProfesional = 2;
    setTimeout(() => this.renderizarBotonGoogle());
  }

  retrocederProfesional(): void {
    this.pasoProfesional = 1;
    setTimeout(() => this.renderizarBotonGoogle());
  }

  enviarGoogle(idToken: string): void {
    const payload = this.prepararPayloadGoogle(idToken);

    if (!payload) {
      return;
    }

    this.ejecutarSolicitud(() => {
      this.authService.google(this.tipoCuenta, payload).subscribe({
        next: (respuesta) => {
          this.mensaje = respuesta.message;
          this.finalizarSolicitudExitosa();
        },
        error: (error) => this.mostrarError(error)
      });
    });
  }

  enviarLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.ejecutarSolicitud(() => {
      this.authService.login(this.tipoCuenta, this.loginForm.getRawValue()).subscribe({
        next: (respuesta) => {
          this.mensaje = respuesta.message;
          this.finalizarSolicitudExitosa();
        },
        error: (error) => this.mostrarError(error)
      });
    });
  }

  enviarRegistro(): void {
    this.configurarValidadoresProfesional();

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const payload = obtenerPayloadRegistro(this.registroForm.getRawValue(), this.tipoCuenta);

    this.ejecutarSolicitud(() => {
      this.authService.registrar(this.tipoCuenta, payload).subscribe({
        next: (respuesta) => {
          this.mensaje = respuesta.message;
          this.finalizarSolicitudExitosa();
          this.registroForm.reset({ disponibilidad: 'Disponible', terminos: false });
          this.modo = 'login';
          this.pasoProfesional = 1;
        },
        error: (error) => this.mostrarError(error)
      });
    });
  }

  campoInvalido(campo: string): boolean {
    const control = this.registroForm.get(campo) || this.loginForm.get(campo);
    return Boolean(control?.invalid && (control.dirty || control.touched));
  }

  get esRegistroProfesional(): boolean {
    return this.modo === 'registro' && this.tipoCuenta === 'profesional';
  }

  get camposCuentaInvalidos(): boolean {
    return ['nombres', 'apellidos', 'correo', 'contrasena']
      .some((campo) => Boolean(this.registroForm.get(campo)?.invalid));
  }

  private ejecutarSolicitud(solicitud: () => void): void {
    this.limpiarEstado();
    this.cargando = true;
    solicitud();
  }

  private prepararPayloadGoogle(idToken: string) {
    if (this.tipoCuenta === 'estudiante' || this.modo === 'login') {
      return { id_token: idToken };
    }

    this.configurarValidadoresProfesional();
    this.marcarCampos(CAMPOS_PROFESIONAL);

    if (this.registroForm.invalid) {
      return null;
    }

    return obtenerPayloadGoogle(idToken, this.registroForm.getRawValue(), this.tipoCuenta, this.modo);
  }

  private renderizarBotonGoogle(): void {
    if (!this.googleButton || this.esRegistroProfesional && this.pasoProfesional === 1) {
      return;
    }

    this.googleAuthService
      .cargarScript()
      .then(() => {
        if (this.googleButton) {
          this.googleAuthService.renderizarBoton(
            this.googleButton.nativeElement,
            this.modo,
            (idToken) => this.enviarGoogle(idToken)
          );
        }
      })
      .catch((error: Error) => {
        this.error = error.message;
      });
  }

  private configurarValidadoresProfesional(): void {
    CAMPOS_PROFESIONAL.forEach((campo) => {
      const control = this.registroForm.get(campo);
      control?.setValidators(this.tipoCuenta === 'profesional' ? [Validators.required] : []);
      control?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private mostrarError(error: HttpErrorResponse): void {
    this.cargando = false;
    const errores = error.error?.errores;
    this.error = Array.isArray(errores) ? errores.join('. ') : error.error?.message || 'No se pudo completar la solicitud.';
  }

  private finalizarSolicitudExitosa(): void {
    this.cargando = false;
  }

  private limpiarEstado(): void {
    this.mensaje = '';
    this.error = '';
    this.cargando = false;
  }

  private marcarCampos(campos: string[]): void {
    campos.forEach((campo) => this.registroForm.get(campo)?.markAsTouched());
  }
}

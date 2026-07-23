import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ApiResponse,
  GoogleAuthPayload,
  LoginPayload,
  LoginResponse,
  RegistroPayload,
  TipoCuenta
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly tokenKey = 'token_apoyo_academico';

  constructor(private readonly http: HttpClient) {}

  login(tipoCuenta: TipoCuenta, payload: LoginPayload): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/${tipoCuenta}/login`, payload)
      .pipe(tap((respuesta) => this.guardarToken(respuesta.data.token)));
  }

  registrar(tipoCuenta: TipoCuenta, payload: RegistroPayload): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(`${this.apiUrl}/${tipoCuenta}/register`, payload);
  }

  google(tipoCuenta: TipoCuenta, payload: GoogleAuthPayload): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${this.apiUrl}/${tipoCuenta}/google`, payload)
      .pipe(tap((respuesta) => this.guardarToken(respuesta.data.token)));
  }

  private guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
}

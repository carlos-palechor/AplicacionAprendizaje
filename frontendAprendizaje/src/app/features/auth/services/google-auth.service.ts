import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ModoAuth } from '../models/auth.models';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme: string;
              size: string;
              shape: string;
              text: string;
              width: number;
            }
          ) => void;
        };
      };
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private readonly clientId: string = environment.googleClientId;
  private scriptPromise?: Promise<void>;

  cargarScript(): Promise<void> {
    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }

    if (this.scriptPromise) {
      return this.scriptPromise;
    }

    this.scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar Google Identity Services.'));
      document.head.appendChild(script);
    });

    return this.scriptPromise;
  }

  renderizarBoton(
    element: HTMLElement,
    modo: ModoAuth,
    callback: (idToken: string) => void
  ): void {
    if (!this.clientId) {
      throw new Error('Configura el Google Client ID del frontend.');
    }

    element.innerHTML = '';
    window.google?.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response) => {
        if (response.credential) {
          callback(response.credential);
        }
      }
    });

    window.google?.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: modo === 'login' ? 'signin_with' : 'signup_with',
      width: Math.max(element.clientWidth, 320)
    });
  }
}

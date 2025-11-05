import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments'; 

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}
@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = `${environment.apiUrl}/usuarios`;
  private readonly USER_STORAGE_KEY = 'todo_user';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    return this.http.post(url, { email, password });
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/registro`;
    // Tu backend espera un body con { nombre, email, password }
    return this.http.post(url, { nombre, email, password });
  }
  guardarSesion(usuario: Usuario): void {
    localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(usuario));
  }

  /**
   * Obtiene el usuario de localStorage
   */
  getUsuarioLogueado(): Usuario | null {
    const usuarioStr = localStorage.getItem(this.USER_STORAGE_KEY);
    if (usuarioStr) {
      return JSON.parse(usuarioStr) as Usuario;
    }
    return null;
  }

  /**
   * Elimina al usuario de localStorage
   */
  cerrarSesion(): void {
    localStorage.removeItem(this.USER_STORAGE_KEY);
  }

  /**
   * Revisa si el usuario está logueado
   */
  isLoggedIn(): boolean {
    return this.getUsuarioLogueado() !== null;
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

// 1. Define la interfaz para un Todo
export interface Todo {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en progreso' | 'completado';
  idUsuario: number;
}

// 2. Define la respuesta de tu API
// (Basado en tu controlador 'getTodosDelUsuario')
export interface TodosResponse {
  todos: Todo[];
}
export interface TodoUpdateResponse {
  message: string;
  todo: Todo;
}

// 3. Define lo que se necesita para crear un Todo
// (Omitimos 'id' porque es autoincremental, e 'idUsuario' se pasará por separado)
export type TodoCrear = Omit<Todo, 'id' | 'estado' | 'idUsuario'> & { estado?: string };


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = `${environment.apiUrl}/todos`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todos los Todos de un usuario
   * Llama a: GET /api/todos/usuario/:idUsuario
   */
  getTodos(idUsuario: number): Observable<TodosResponse> {
    const url = `${this.apiUrl}/usuario/${idUsuario}`;
    return this.http.get<TodosResponse>(url);
  }

  /**
   * Crea un nuevo Todo
   * Llama a: POST /api/todos
   */
  crearTodo(titulo: string, descripcion: string, idUsuario: number): Observable<any> {
    const url = `${this.apiUrl}/`;
    // Tu backend espera: { titulo, descripcion, idUsuario }
    return this.http.post(url, { titulo, descripcion, idUsuario });
  }

  /**
   * Elimina un Todo
   * Llama a: DELETE /api/todos/:id
   */
  eliminarTodo(idTodo: number, idUsuario: number): Observable<any> {
    const url = `${this.apiUrl}/${idTodo}`;
    
    // Tu backend espera idUsuario en el body
    const options = {
      body: {
        idUsuario: idUsuario
      }
    };
    return this.http.delete(url, options);
  }

  /**
   * Cambia el estado de un Todo
   * Llama a: PATCH /api/todos/:id/estado
   */
  cambiarEstado(idTodo: number, idUsuario: number, estado: string): Observable<TodoUpdateResponse> {  //error ha propósito en presentacion
    const url = `${this.apiUrl}/${idTodo}/estado`;
    // Tu backend espera: { estado, idUsuario }
    return this.http.patch<TodoUpdateResponse>(url, { estado, idUsuario });
  }

  // (Podríamos añadir 'actualizarTodo' (PUT) después)
}
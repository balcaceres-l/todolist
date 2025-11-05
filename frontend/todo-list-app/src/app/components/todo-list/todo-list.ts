import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // para *ngFor, *ngIf
import { Router, RouterLink } from '@angular/router';
import {FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para el formulario de crear

// Importa los servicios y modelos
import { AuthService, Usuario } from '../../services/auth';
import { TodoService, Todo, TodoUpdateResponse } from '../../services/todo';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Añade esto
    RouterLink         // Añade esto
  ],
  templateUrl: './todo-list.html',
  styleUrls: ['./todo-list.css']
})
export class TodoListComponent implements OnInit {

  usuario: Usuario | null = null;
  todos: Todo[] = []; // Array para guardar las tareas
  todoForm: FormGroup; // Formulario para crear tareas
  errorMensaje: string | null = null;
  
  // Estados posibles para el dropdown
  estadosPosibles: string[] = ['pendiente', 'en progreso', 'completado'];

  constructor(
    private authService: AuthService,
    private todoService: TodoService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Definición del formulario reactivo
    this.todoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // 1. Al cargar, obtén el usuario
    this.usuario = this.authService.getUsuarioLogueado();

    // 2. Si no hay usuario, sácalo de aquí
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }

    // 3. Si hay usuario, carga sus tareas
    this.cargarTodos();
  }

  cargarTodos(): void {
    if (this.usuario) {
      this.todoService.getTodos(this.usuario.id).subscribe({
        next: (response) => {
          this.todos = response.todos; // Guarda las tareas en el array
        },
        error: (err) => {
          this.errorMensaje = 'Error al cargar las tareas.';
          console.error(err);
        }
      });
    }
  }

  /**
   * Se llama al enviar el formulario de nueva tarea
   */
  onCrearTodo(): void {
    if (this.todoForm.invalid || !this.usuario) {
      this.todoForm.markAllAsTouched();
      return;
    }

    const { titulo, descripcion } = this.todoForm.value;

    this.todoService.crearTodo(titulo, descripcion, this.usuario.id).subscribe({
      next: () => {
        this.cargarTodos(); // Vuelve a cargar la lista
        this.todoForm.reset(); // Limpia el formulario
      },
      error: (err) => {
        this.errorMensaje = 'Error al crear la tarea.';
        console.error(err);
      }
    });
  }

  /**
   * Se llama al borrar una tarea
   */
  onEliminarTodo(idTodo: number): void {
    if (!this.usuario) return;

    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.todoService.eliminarTodo(idTodo, this.usuario.id).subscribe({
        next: () => {
          this.cargarTodos(); // Recarga la lista
        },
        error: (err) => {
          this.errorMensaje = 'Error al eliminar la tarea.';
          console.error(err);
        }
      });
    }
  }

  /**
   * Se llama al cambiar el estado de una tarea
   */
  onCambiarEstado(idTodo: number, event: Event): void {
    if (!this.usuario) return;

    const selectElement = event.target as HTMLSelectElement;
    const nuevoEstado = selectElement.value;

    console.log(`CAMBIANDO TODO #${idTodo} AL ESTADO: ${nuevoEstado}`);

    this.todoService.cambiarEstado(idTodo, this.usuario.id, nuevoEstado).subscribe({
      
      next: (response) => { 
        
        // --- 1. ¿QUÉ DICE EL BACKEND? ---
        // El backend debe devolver la tarea con el estado YA actualizado.
        console.log('RESPUESTA DEL BACKEND:', response.todo);
        
        const todoActualizado = response.todo; 

        // --- 2. VERIFICACIÓN CRÍTICA ---
        if (todoActualizado.estado !== nuevoEstado) {
          console.error('¡ERROR DE LÓGICA! El backend NO devolvió el estado actualizado.');
          // Si ves este error, el problema está en tu API de Node.js
        }

        const index = this.todos.findIndex(t => t.id === todoActualizado.id);

        if (index !== -1) {
          
          console.log('Encontrada tarea local, actualizando...');
          
          // Creamos una NUEVA copia del array
          const nuevosTodos = [
            ...this.todos.slice(0, index), 
            todoActualizado,               
            ...this.todos.slice(index + 1) 
          ];

          this.todos = nuevosTodos;
          
          // --- 3. ¿CÓMO QUEDÓ EL ARRAY LOCAL? ---
          console.log('Array local actualizado. Nuevo estado:', this.todos[index].estado);

        } else {
          console.warn('No se encontró la tarea en el array local, recargando todo...');
          // Este es el ÚNICO caso donde deberías recargar
          this.cargarTodos(); 
        }

        // --- 4. VERIFICACIÓN FINAL ---
        // ¡¡ASEGÚRATE DE QUE NO HAYA OTRO "this.cargarTodos()" AQUÍ!!
        // Si tienes un `this.cargarTodos()` aquí abajo, bórralo.
        // this.cargarTodos(); <--- ¡¡¡ESTO CAUSARÍA EL ERROR!!!
      },

      error: (err) => {
        this.errorMensaje = 'Error al cambiar el estado.';
        console.error('Error del PATCH:', err);
        
        // Si hay un error, SÍ recargamos para revertir el combo box.
        console.log('Error, revirtiendo cambios visuales...');
        this.cargarTodos();
      }
    });
  }

  /**
   * Cierra la sesión del usuario
   */
  onLogout(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
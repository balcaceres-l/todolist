import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { Router, RouterLink } from '@angular/router'; // Para redirigir después del login
import { AuthService, Usuario } from '../../services/auth';
// 1. Importa todo lo necesario para Reactive Forms
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  
  loginForm: FormGroup;
  errorMensaje: string | null = null; // Para mostrar errores del backend

  constructor(
    private fb: FormBuilder,        // Inyecta el FormBuilder
    private authService: AuthService, // Inyecta tu servicio
    private router: Router          // Inyecta el Router
  ) {
 
    this.loginForm = this.fb.group({
      // El primer string es el valor por defecto
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Se ejecuta cuando el usuario envía el formulario
   */
  onSubmit() {
    // Si el formulario es inválido, no hagas nada
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Marca todos los campos como "tocados" para mostrar errores
      return;
    }

    // Limpia errores previos
    this.errorMensaje = null;

    // Obtiene los valores del formulario
    const { email, password } = this.loginForm.value;

    // 5. Llama al servicio de login
    this.authService.login(email, password).subscribe({
      next: (respuesta) => {
        // ¡Login exitoso!
        console.log('Login exitoso:', respuesta.usuario);
        this.authService.guardarSesion(respuesta.usuario as Usuario);
        // Aquí es donde se guarda el usuario (localStorage )
        // localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        this.router.navigate(['/todos']);
        // Redirige al usuario a la lista de tareas (crearemos esta ruta después)
        // this.router.navigate(['/todos']); 
        alert(`¡Bienvenido ${respuesta.usuario.nombre}!`);
      },
      error: (err) => {
        // 6. Maneja el error del backend
        console.error('Error en login:', err);
        // Tu backend envía el error en err.error.message (según tu controlador)
        this.errorMensaje = err.error.message || 'Error desconocido. Intenta de nuevo.';
      }
    });
  }

  // --- Helpers para mostrar errores en el HTML ---
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
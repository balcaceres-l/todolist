import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importa RouterLink
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink // Añade RouterLink para el enlace "Inicia sesión"
  ],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {

  registroForm: FormGroup;
  errorMensaje: string | null = null;
  exitoMensaje: string | null = null; // Para notificar al usuario

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // 1. Define el formulario con los 3 campos
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    // Limpia mensajes previos
    this.errorMensaje = null;
    this.exitoMensaje = null;

    const { nombre, email, password } = this.registroForm.value;

    // 2. Llama al nuevo método del servicio
    this.authService.registro(nombre, email, password).subscribe({
      next: (respuesta) => {
        // ¡Registro exitoso!
        console.log('Registro exitoso:', respuesta);
        this.exitoMensaje = "¡Usuario creado! Serás redirigido al login...";

        // 3. Redirige al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        // 4. Maneja el error (ej: "El email ya está registrado")
        console.error('Error en registro:', err);
        this.errorMensaje = err.error.message || 'Error desconocido al registrar.';
      }
    });
  }

  // --- Helpers para mostrar errores en el HTML ---
  get nombre() { return this.registroForm.get('nombre'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
}
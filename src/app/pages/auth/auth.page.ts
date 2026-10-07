import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WaveLinesComponent } from '../../shared/components/wave-lines.component';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, WaveLinesComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth.page.html',
})
export class AuthPage {
  private readonly formBuilder = inject(FormBuilder);
  readonly mode = signal<AuthMode>('login');
  readonly showPassword = signal(false);
  readonly notice = signal('');

  readonly form = this.formBuilder.nonNullable.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  setMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.notice.set('');
    const name = this.form.controls.name;
    name.setValidators(mode === 'register' ? [Validators.required, Validators.minLength(2)] : []);
    name.updateValueAndValidity();
  }

  togglePassword(): void {
    this.showPassword.update((visible) => !visible);
  }

  submit(): void {
    this.notice.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.notice.set('Formulário validado. A conexão com um serviço de autenticação ainda precisa ser configurada.');
  }
}
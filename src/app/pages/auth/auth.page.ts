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
  styles: `
    .auth-input-frame {
      position: relative;
      border-radius: 0.75rem;
    }

    .auth-input-frame::after {
      position: absolute;
      inset: -1px;
      padding: 1.5px;
      border-radius: inherit;
      content: '';
      opacity: 0;
      pointer-events: none;
      background: conic-gradient(
        from var(--auth-border-angle),
        #4cb3ff 0deg,
        #2f6fd6 110deg,
        #123858 195deg,
        #2f6fd6 280deg,
        #4cb3ff 360deg
      );
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      transition: opacity 160ms ease;
    }

    .auth-input-frame:focus-within::after {
      opacity: 1;
      animation: auth-border-orbit 7s linear infinite;
    }

    .auth-input-frame.auth-input-error::after {
      background: conic-gradient(
        from var(--auth-border-angle),
        #ff7a8a 0deg,
        #a84762 130deg,
        #56304d 220deg,
        #ff7a8a 360deg
      );
    }

    @media (prefers-reduced-motion: reduce) {
      .auth-input-frame::after {
        animation: none;
        transition: none;
      }
    }
  `,
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
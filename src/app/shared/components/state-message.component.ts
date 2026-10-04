import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export type StateKind = 'loading' | 'error' | 'empty';

/** Mensagem para carregando, erro e lista vazia. No erro, oferece tentar de novo. */
@Component({
  selector: 'app-state-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rounded-onda border border-dashed px-6 py-10 text-center"
      [class]="kind() === 'error' ? 'border-erro/60' : 'border-borda'"
      [attr.role]="kind() === 'error' ? 'alert' : 'status'"
    >
      @if (kind() === 'loading') {
        <span class="mx-auto mb-4 block h-6 w-6 animate-spin rounded-full border-2 border-borda border-t-destaque"></span>
      }
      <p class="font-titulo text-lg" [class]="kind() === 'error' ? 'text-erro' : 'text-texto'">{{ heading() }}</p>
      @if (detail()) {
        <p class="mx-auto mt-2 max-w-md text-sm text-suave">{{ detail() }}</p>
      }
      @if (kind() === 'error') {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-5 rounded-full border border-destaque px-5 py-2 text-sm text-destaque hover:bg-destaque/10"
        >
          Tentar de novo
        </button>
      }
    </div>
  `,
})
export class StateMessageComponent {
  readonly kind = input.required<StateKind>();
  readonly heading = input.required<string>();
  readonly detail = input('');
  readonly retry = output<void>();
}

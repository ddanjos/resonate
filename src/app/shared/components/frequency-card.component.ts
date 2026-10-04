import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Frequency, GOAL_LABELS, KIND_LABELS } from '../../core/models/frequency.model';

/** Cartão de uma frequência. Avisa o pai quando o usuário adiciona ou remove da sessão. */
@Component({
  selector: 'app-frequency-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="flex h-full flex-col rounded-onda border bg-superficie/80 p-5 transition-shadow"
      [class]="selected() ? 'border-destaque shadow-brilho' : 'border-borda'"
    >
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-titulo text-lg font-semibold leading-snug text-texto">
          <a [routerLink]="['/detail', frequency().id]" class="hover:text-destaque">{{ frequency().name }}</a>
        </h3>
        <span class="shrink-0 rounded-full bg-fundo px-3 py-1 text-xs text-onda">{{ goalLabel() }}</span>
      </div>

      <p class="mt-2 text-sm text-suave">{{ kindLabel() }} · {{ frequency().hz }} Hz · {{ frequency().durationMin }} min</p>
      <p class="mt-3 line-clamp-2 flex-1 text-sm text-texto/80">{{ frequency().description }}</p>

      <button
        type="button"
        (click)="toggle.emit(frequency().id)"
        [attr.aria-pressed]="selected()"
        class="mt-4 rounded-full border px-4 py-2 text-sm font-medium transition-colors"
        [class]="
          selected()
            ? 'border-destaque bg-destaque text-fundo'
            : 'border-destaque/50 text-destaque hover:bg-destaque/10'
        "
      >
        {{ selected() ? 'Remover da sessão' : 'Adicionar à sessão' }}
      </button>
    </article>
  `,
})
export class FrequencyCardComponent {
  readonly frequency = input.required<Frequency>();
  readonly selected = input(false);
  readonly toggle = output<string>();

  goalLabel(): string {
    return GOAL_LABELS[this.frequency().goal];
  }

  kindLabel(): string {
    return KIND_LABELS[this.frequency().kind];
  }
}

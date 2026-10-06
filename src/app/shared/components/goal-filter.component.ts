import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Goal } from '../../core/models/frequency.model';

export type GoalFilterValue = Goal | 'todos';

@Component({
  selector: 'app-goal-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por objetivo">
      @for (opt of options(); track opt.value) {
        <button
          type="button"
          (click)="changed.emit(opt.value)"
          [attr.aria-pressed]="opt.value === active()"
          class="rounded-full border px-4 py-2 text-sm transition-colors"
          [class]="
            opt.value === active()
              ? 'border-destaque bg-destaque/15 text-destaque'
              : 'border-borda text-suave hover:border-destaque/60 hover:text-texto'
          "
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
})
export class GoalFilterComponent {
  readonly options = input.required<{ value: GoalFilterValue; label: string }[]>();
  readonly active = input.required<GoalFilterValue>();
  readonly changed = output<GoalFilterValue>();
}

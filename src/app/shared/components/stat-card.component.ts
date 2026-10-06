import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full rounded-2xl border border-borda bg-superficie/80 px-5 py-4">
      <p class="text-sm text-suave">{{ label() }}</p>
      <p class="mt-1 font-titulo text-2xl font-semibold text-texto">{{ value() }}</p>
      @if (hint()) {
        <p class="mt-1 text-xs text-suave">{{ hint() }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly hint = input('');
}

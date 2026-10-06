import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PlaybackMode } from '../../core/models/frequency.model';

@Component({
  selector: 'app-playback-mode',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inline-flex rounded-full border border-borda bg-fundo p-1" role="group" aria-label="Modo de reprodução">
      <button
        type="button"
        (click)="changed.emit('sequential')"
        [attr.aria-pressed]="mode() === 'sequential'"
        class="rounded-full px-3 py-1.5 text-xs transition-colors"
        [class]="mode() === 'sequential' ? 'bg-destaque/15 text-destaque' : 'text-suave hover:text-texto'"
      >
        Em sequência
      </button>
      <button
        type="button"
        (click)="changed.emit('simultaneous')"
        [attr.aria-pressed]="mode() === 'simultaneous'"
        class="rounded-full px-3 py-1.5 text-xs transition-colors"
        [class]="mode() === 'simultaneous' ? 'bg-destaque/15 text-destaque' : 'text-suave hover:text-texto'"
      >
        Ao mesmo tempo
      </button>
    </div>
  `,
})
export class PlaybackModeComponent {
  readonly mode = input.required<PlaybackMode>();
  readonly changed = output<PlaybackMode>();
}
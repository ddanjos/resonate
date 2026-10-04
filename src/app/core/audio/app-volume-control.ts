import { Component, computed, inject } from '@angular/core';
import { AudioEngine } from '../../core/audio/audio-engine.service';

@Component({
  selector: 'app-volume-control',
  standalone: true,
  template: `
    <div class="flex items-center gap-3">
      <button
        type="button"
        (click)="audio.muted.set(!audio.muted())"
        [attr.aria-pressed]="audio.muted()"
        class="rounded-full border border-borda px-3 py-1 text-xs text-suave hover:text-texto"
      >
        {{ audio.muted() ? 'Ativar som' : 'Silenciar' }}
      </button>
      <input
        type="range" min="0" max="100" step="1"
        [value]="audio.volume() * 100"
        (input)="onInput($event)"
        aria-label="Volume"
        class="h-1 w-28 accent-destaque"
      />
      <span class="w-9 text-right text-xs tabular-nums text-suave">{{ pct() }}%</span>
    </div>
  `,
})
export class VolumeControl {
  protected audio = inject(AudioEngine);
  protected pct = computed(() => (this.audio.muted() ? 0 : Math.round(this.audio.volume() * 100)));

  onInput(e: Event): void {
    const v = Number((e.target as HTMLInputElement).value) / 100;
    this.audio.volume.set(v);
    if (v > 0) this.audio.muted.set(false);
  }
}
import { Component, computed, inject } from '@angular/core';
import { AudioEngine } from '../../core/audio/audio-engine.service';

@Component({
  selector: 'app-volume-control',
  standalone: true,
  template: `
    <div class="flex min-w-0 items-center gap-2 lg:gap-3">
      <button
        type="button"
        (click)="audio.toggleMute()"
        [attr.aria-pressed]="audio.muted()"
        [attr.aria-label]="audio.muted() ? 'Ativar som' : 'Silenciar'"
        [attr.title]="audio.muted() ? 'Ativar som' : 'Silenciar'"
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-borda text-suave transition-colors hover:border-destaque/50 hover:text-destaque"
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          @if (audio.muted()) {
            <path d="m16 9 5 6m0-6-5 6" />
          } @else {
            <path d="M15.5 8.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13" />
          }
        </svg>
      </button>
      <label class="flex min-w-0 flex-1 items-center gap-2 lg:flex-none">
        <input
          type="range" min="0" max="100" step="1"
          [value]="audio.volume() * 100"
          (input)="onInput($event)"
          aria-label="Volume"
          class="h-1 min-w-0 flex-1 accent-destaque lg:w-28 lg:flex-none"
        />
      </label>
      <span class="w-9 shrink-0 text-right text-xs tabular-nums text-suave">{{ pct() }}%</span>
    </div>
  `,
})
export class VolumeControl {
  protected audio = inject(AudioEngine);
  protected pct = computed(() => (this.audio.muted() ? 0 : Math.round(this.audio.volume() * 100)));

  onInput(e: Event): void {
    const v = Number((e.target as HTMLInputElement).value) / 100;
    if (v > 0) this.audio.muted.set(false);
    this.audio.setVolume(v);
  }
}